-- ============================================================================
-- MESSAGERIE — GARDE-FOUS ANTI-ABUS — Priorité 2 de l'audit (H3)
-- À exécuter UNE fois dans Supabase → SQL Editor → Run. Idempotent.
--
--   • Blocage : un participant peut bloquer un contact (plus de messages reçus).
--   • Anti-spam : limite de débit + limite de « premiers contacts » par heure.
--   • Signalement : un abus est remonté à l'organisateur (console).
-- Tout est appliqué côté SERVEUR (trigger + RLS) : non contournable par le client.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) BLOCAGES
-- ----------------------------------------------------------------------------
create table if not exists public.blocks (
  blocker    uuid references public.profiles(id) on delete cascade,
  blocked    uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (blocker, blocked)
);
alter table public.blocks enable row level security;
drop policy if exists "blocks_rw" on public.blocks;
-- Chacun gère SES propres blocages (et voit aussi qui l'a bloqué, utile au client).
create policy "blocks_rw" on public.blocks for all
  using (blocker = auth.uid() or blocked = auth.uid())
  with check (blocker = auth.uid());

-- ----------------------------------------------------------------------------
-- 2) SIGNALEMENTS (lus par l'organisateur)
-- ----------------------------------------------------------------------------
create table if not exists public.reports (
  id          uuid primary key default uuid_generate_v4(),
  reporter    uuid references public.profiles(id) on delete set null,
  reported    uuid references public.profiles(id) on delete cascade,
  message_id  uuid references public.messages(id) on delete set null,
  reason      text default '',
  status      text default 'open' check (status in ('open','reviewed','dismissed')),
  created_at  timestamptz default now()
);
alter table public.reports enable row level security;
drop policy if exists "reports_insert" on public.reports;
drop policy if exists "reports_admin"  on public.reports;
-- Un participant crée SES signalements ; l'organisateur lit/traite tout.
create policy "reports_insert" on public.reports for insert with check (reporter = auth.uid());
create policy "reports_admin"  on public.reports for all    using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- 3) GARDE-FOUS À L'ENVOI (trigger BEFORE INSERT sur messages)
--    SECURITY DEFINER : peut consulter blocks/messages sans être gêné par la RLS.
-- ----------------------------------------------------------------------------
create or replace function public.enforce_message_policy()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_recent     int;
  v_new_convos int;
  v_is_new     boolean;
begin
  -- Blocage dans un sens ou l'autre.
  if exists (
    select 1 from public.blocks
    where (blocker = new.recipient and blocked = new.sender)
       or (blocker = new.sender    and blocked = new.recipient)
  ) then
    raise exception 'OAF_BLOCKED' using hint = 'Échange indisponible avec ce contact.';
  end if;

  -- Limite de débit : 30 messages / minute maximum.
  select count(*) into v_recent
  from public.messages
  where sender = new.sender and created_at > now() - interval '1 minute';
  if v_recent >= 30 then
    raise exception 'OAF_RATE' using hint = 'Trop de messages en peu de temps. Réessayez dans un instant.';
  end if;

  -- Anti-démarchage de masse : pas plus de 20 NOUVELLES conversations / heure.
  select not exists (
    select 1 from public.messages
    where (sender = new.sender and recipient = new.recipient)
       or (sender = new.recipient and recipient = new.sender)
  ) into v_is_new;
  if v_is_new then
    select count(distinct recipient) into v_new_convos
    from public.messages m
    where m.sender = new.sender
      and m.created_at > now() - interval '1 hour'
      and not exists (
        select 1 from public.messages p
        where p.created_at < m.created_at
          and ((p.sender = m.sender and p.recipient = m.recipient)
            or (p.sender = m.recipient and p.recipient = m.sender))
      );
    if v_new_convos >= 20 then
      raise exception 'OAF_RATE' using hint = 'Trop de nouveaux contacts en une heure.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_message_policy on public.messages;
create trigger trg_message_policy
  before insert on public.messages for each row execute function public.enforce_message_policy();

-- Temps réel pour la modération (optionnel).
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='reports')
  then alter publication supabase_realtime add table reports; end if;
end $$;
