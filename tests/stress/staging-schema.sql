-- Désactive la validation des corps de fonction (références en avant sur base neuve).
set check_function_bodies = off;

-- ============================================================================
-- SCHÉMA STAGING (stress test) — OAF Connect
-- À exécuter UNE fois dans le SQL Editor du projet Supabase 'oaf-staging'.
-- Combinaison, dans l'ordre, de : schema.sql + access-control.sql +
-- messaging-safety.sql + perf-p0.sql + security-hardening.sql.
-- ⚠️ STAGING JETABLE UNIQUEMENT — jamais la production.
-- ============================================================================


-- ########## supabase/schema.sql ##########

-- ============================================================================
-- OAF Connect — schéma de production (Supabase / PostgreSQL)
-- Idempotent : peut être ré-exécuté sans erreur.
-- À exécuter dans Supabase → SQL Editor (voir supabase/README.md).
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- PROFILS
-- ----------------------------------------------------------------------------
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null default '',
  role        jsonb default '{"fr":"","en":""}',
  company     text default '',
  country     text default '🌍',
  photo_url   text,
  interests   text[] default '{}',
  looking_for jsonb default '{"fr":"","en":""}',
  languages   text[] default '{fr,en}',
  is_visible  boolean default true,
  is_admin    boolean default false,
  created_at  timestamptz default now()
);

create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
declare g public.guests%rowtype;
begin
  -- Profil pré-chargé correspondant à cet e-mail ? (voir preload-claim.sql)
  begin
    select * into g from public.guests
    where email is not null and lower(email) = lower(new.email)
    order by created_at limit 1;
  exception when undefined_column then g := null; end;

  insert into public.profiles (id, name, role, country, interests, looking_for, photo_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', g.name, split_part(new.email,'@',1)),
    coalesce(g.role, '{"fr":"","en":""}'::jsonb),
    coalesce(g.country, '🌍'),
    coalesce(g.interests, '{}'::text[]),
    coalesce(g.looking_for, '{"fr":"","en":""}'::jsonb),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  )
  on conflict (id) do nothing;

  if g.id is not null then delete from public.guests where id = g.id; end if;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function handle_new_user();

-- ----------------------------------------------------------------------------
-- ÉVÉNEMENTS / PROGRAMME / INTERVENANTS / PARTENAIRES
-- ----------------------------------------------------------------------------
create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  name text not null, city text default '', city_short text default '',
  status text default 'upcoming' check (status in ('live','upcoming','past')),
  dates jsonb default '{"fr":"","en":""}', theme jsonb default '{"fr":"","en":""}',
  cover_url text, info jsonb default '{}',
  starts_at timestamptz, ends_at timestamptz, auto_status boolean default false,
  created_at timestamptz default now()
);
create table if not exists sessions (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade,
  day int default 0, time text default '12:00', dur text default '45m',
  title jsonb default '{"fr":"","en":""}', room jsonb default '{"fr":"","en":""}',
  track jsonb default '{"fr":"","en":""}', description jsonb default '{"fr":"","en":""}',
  color text default '#5b8def', created_at timestamptz default now()
);
create table if not exists speakers (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade,
  name text not null, role jsonb default '{"fr":"","en":""}',
  country text default '🌍', photo_url text, bio jsonb default '{"fr":"","en":""}', tags text[] default '{}'
);
create table if not exists sponsors (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade,
  name text not null, tier text default 'SILVER', logo_url text,
  description jsonb default '{"fr":"","en":""}', booth jsonb default '{"fr":"","en":""}', color text default '#5b8def'
);
create table if not exists event_attendees (
  event_id uuid references events(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (event_id, profile_id)
);

-- ----------------------------------------------------------------------------
-- NETWORKING
-- ----------------------------------------------------------------------------
create table if not exists connections (
  id uuid primary key default uuid_generate_v4(),
  requester uuid references profiles(id) on delete cascade,
  addressee uuid references profiles(id) on delete cascade,
  status text default 'pending' check (status in ('pending','accepted','declined')),
  created_at timestamptz default now(), unique (requester, addressee)
);
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  sender uuid references profiles(id) on delete cascade,
  recipient uuid references profiles(id) on delete cascade,
  body text not null, read_at timestamptz, created_at timestamptz default now()
);
create table if not exists meetings (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade,
  organizer uuid references profiles(id) on delete cascade,
  guest uuid references profiles(id) on delete cascade,
  slot timestamptz, location text,
  status text default 'pending' check (status in ('pending','confirmed','declined')),
  created_at timestamptz default now()
);
create table if not exists bookmarks (
  profile_id uuid references profiles(id) on delete cascade,
  session_id uuid references sessions(id) on delete cascade,
  primary key (profile_id, session_id)
);
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade,
  icon text default '🔔', title jsonb default '{"fr":"","en":""}', created_at timestamptz default now()
);

-- ============================================================================
-- SÉCURITÉ (RLS)
-- ============================================================================
alter table profiles        enable row level security;
alter table events          enable row level security;
alter table sessions        enable row level security;
alter table speakers        enable row level security;
alter table sponsors        enable row level security;
alter table event_attendees enable row level security;
alter table connections     enable row level security;
alter table messages        enable row level security;
alter table meetings        enable row level security;
alter table bookmarks       enable row level security;
alter table notifications   enable row level security;

-- SECURITY DEFINER : indispensable pour éviter la récursion RLS quand is_admin()
-- est appelée DANS une politique de la table profiles (sinon « stack depth limit
-- exceeded »). set search_path fige le chemin (sécurité).
create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

drop policy if exists "profiles_read"   on profiles;
drop policy if exists "profiles_update" on profiles;
create policy "profiles_read"   on profiles for select using (is_visible or id = auth.uid() or is_admin());
create policy "profiles_update" on profiles for update using (id = auth.uid());

drop policy if exists "events_read"   on events;
drop policy if exists "events_admin"  on events;
drop policy if exists "sessions_read" on sessions;
drop policy if exists "sessions_admin"on sessions;
drop policy if exists "speakers_read" on speakers;
drop policy if exists "speakers_admin"on speakers;
drop policy if exists "sponsors_read" on sponsors;
drop policy if exists "sponsors_admin"on sponsors;
drop policy if exists "notif_read"    on notifications;
drop policy if exists "notif_admin"   on notifications;
create policy "events_read"   on events   for select using (auth.role() = 'authenticated');
create policy "events_admin"  on events   for all    using (is_admin()) with check (is_admin());
create policy "sessions_read" on sessions for select using (auth.role() = 'authenticated');
create policy "sessions_admin"on sessions for all    using (is_admin()) with check (is_admin());
create policy "speakers_read" on speakers for select using (auth.role() = 'authenticated');
create policy "speakers_admin"on speakers for all    using (is_admin()) with check (is_admin());
create policy "sponsors_read" on sponsors for select using (auth.role() = 'authenticated');
create policy "sponsors_admin"on sponsors for all    using (is_admin()) with check (is_admin());
create policy "notif_read"    on notifications for select using (auth.role() = 'authenticated');
create policy "notif_admin"   on notifications for all    using (is_admin()) with check (is_admin());

drop policy if exists "ea_read"  on event_attendees;
drop policy if exists "ea_self"  on event_attendees;
drop policy if exists "ea_admin" on event_attendees;
create policy "ea_read"  on event_attendees for select using (auth.role() = 'authenticated');
create policy "ea_self"  on event_attendees for insert with check (profile_id = auth.uid());
create policy "ea_admin" on event_attendees for all using (is_admin()) with check (is_admin());

drop policy if exists "conn_rw"  on connections;
drop policy if exists "msg_read" on messages;
drop policy if exists "msg_send" on messages;
drop policy if exists "meet_rw"  on meetings;
drop policy if exists "bm_rw"    on bookmarks;
create policy "conn_rw" on connections for all
  using (requester = auth.uid() or addressee = auth.uid())
  with check (requester = auth.uid() or addressee = auth.uid());
create policy "msg_read" on messages for select using (sender = auth.uid() or recipient = auth.uid());
create policy "msg_send" on messages for insert with check (sender = auth.uid());
create policy "meet_rw" on meetings for all
  using (organizer = auth.uid() or guest = auth.uid()) with check (organizer = auth.uid() or guest = auth.uid());
create policy "bm_rw" on bookmarks for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- Temps réel (ajout idempotent à la publication)
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='messages')      then alter publication supabase_realtime add table messages;      end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='notifications') then alter publication supabase_realtime add table notifications; end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='connections')   then alter publication supabase_realtime add table connections;   end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='events')        then alter publication supabase_realtime add table events;        end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='sessions')      then alter publication supabase_realtime add table sessions;      end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='speakers')      then alter publication supabase_realtime add table speakers;      end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='sponsors')      then alter publication supabase_realtime add table sponsors;      end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='event_attendees') then alter publication supabase_realtime add table event_attendees; end if;
end $$;

-- ============================================================================
-- Annuaire de participants importés (sans compte), propre à chaque forum.
-- Permet de pré-remplir un forum avec une liste (CSV) avant l'événement.
-- ============================================================================
create table if not exists guests (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade,
  name text not null,
  email text,
  role jsonb default '{"fr":"","en":""}',
  country text default '🌍',
  interests text[] default '{}',
  looking_for jsonb default '{"fr":"","en":""}',
  created_at timestamptz default now()
);
create index if not exists guests_email_idx on guests (lower(email));
alter table guests enable row level security;
drop policy if exists "guests_read"  on guests;
drop policy if exists "guests_admin" on guests;
create policy "guests_read"  on guests for select using (auth.role() = 'authenticated');
create policy "guests_admin" on guests for all    using (is_admin()) with check (is_admin());
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='guests') then alter publication supabase_realtime add table guests; end if;
end $$;

-- ============================================================================
-- Fiches de séance : intervenants/modérateur par séance + Q&A du public
-- ============================================================================
create table if not exists session_speakers (
  session_id uuid references sessions(id) on delete cascade,
  speaker_id uuid references speakers(id) on delete cascade,
  role text default 'speaker' check (role in ('speaker','moderator')),
  primary key (session_id, speaker_id)
);
alter table session_speakers enable row level security;
drop policy if exists "ss_read"  on session_speakers;
drop policy if exists "ss_admin" on session_speakers;
create policy "ss_read"  on session_speakers for select using (auth.role() = 'authenticated');
create policy "ss_admin" on session_speakers for all    using (is_admin()) with check (is_admin());

create table if not exists questions (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references sessions(id) on delete cascade,
  event_id uuid references events(id) on delete cascade,
  author uuid references profiles(id) on delete set null,
  body text not null,
  created_at timestamptz default now()
);
alter table questions enable row level security;
drop policy if exists "q_read"   on questions;
drop policy if exists "q_insert" on questions;
drop policy if exists "q_admin"  on questions;
create policy "q_read"   on questions for select using (auth.role() = 'authenticated');
create policy "q_insert" on questions for insert with check (author = auth.uid());
create policy "q_admin"  on questions for all    using (is_admin()) with check (is_admin());

create table if not exists question_votes (
  question_id uuid references questions(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  primary key (question_id, profile_id)
);
alter table question_votes enable row level security;
drop policy if exists "qv_read" on question_votes;
drop policy if exists "qv_self" on question_votes;
create policy "qv_read" on question_votes for select using (auth.role() = 'authenticated');
create policy "qv_self" on question_votes for all    using (profile_id = auth.uid()) with check (profile_id = auth.uid());

do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='session_speakers') then alter publication supabase_realtime add table session_speakers; end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='questions')        then alter publication supabase_realtime add table questions;        end if;
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='question_votes')   then alter publication supabase_realtime add table question_votes;   end if;
end $$;

-- ============================================================================
-- DONNÉE D'EXEMPLE (insérée seulement si la table est vide)
-- ============================================================================
insert into events (name, city, city_short, status, dates, theme)
select 'OneAfrica Forum 2026','Kigali, Rwanda','Kigali','live',
       '{"fr":"12–14 juin 2026","en":"12–14 Jun 2026"}',
       '{"fr":"Business, Investissement & Leadership","en":"Business, Investment & Leadership"}'
where not exists (select 1 from events);

-- Pour devenir admin (après votre 1re connexion dans l'app) :
--   update profiles set is_admin = true
--   where id = (select id from auth.users where email = 'VOTRE_EMAIL');

-- ########## supabase/access-control.sql ##########

-- ============================================================================
-- CONTRÔLE D'ACCÈS — Priorité 1 de l'audit (H1 + H2)
-- À exécuter UNE fois dans Supabase → SQL Editor → Run. Idempotent.
--
--   H1 — Annuaire cloisonné : on ne voit un profil que si on PARTAGE un forum.
--   H2 — Inscription sur invitation : seul un e-mail importé (guests) ou invité
--        (invites) peut créer un compte. Les membres existants ne sont pas
--        touchés (le trigger ne se déclenche qu'à la CRÉATION d'un compte).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- H1 — « Partage-t-on un même événement ? » (SECURITY DEFINER => ignore la RLS
-- de event_attendees, donc pas de récursion de politique).
-- ----------------------------------------------------------------------------
create or replace function public.shares_event(other uuid)
returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select exists (
    select 1
    from public.event_attendees a
    join public.event_attendees b on a.event_id = b.event_id
    where a.profile_id = auth.uid() and b.profile_id = other
  );
$$;

-- Annuaire : sa propre fiche, OU admin, OU (fiche visible ET on partage un forum).
drop policy if exists "profiles_read" on public.profiles;
create policy "profiles_read" on public.profiles for select using (
  id = auth.uid() or public.is_admin() or (is_visible and public.shares_event(id))
);

-- Invités importés (guests) : visibles seulement aux participants de LEUR forum.
drop policy if exists "guests_read" on public.guests;
create policy "guests_read" on public.guests for select using (
  public.is_admin() or exists (
    select 1 from public.event_attendees a
    where a.profile_id = auth.uid() and a.event_id = guests.event_id
  )
);

-- ----------------------------------------------------------------------------
-- H2 — Inscription sur invitation, appliquée par le trigger de création.
-- Conserve tout le comportement existant (pré-remplissage du profil depuis la
-- liste importée + suppression du doublon invité) et ajoute :
--   (1) le refus des e-mails non invités ;
--   (2) le rattachement automatique de l'invité à son forum (event_attendees).
-- ----------------------------------------------------------------------------
-- NB : on lit NEW via to_jsonb() et on sélectionne les colonnes invité dans des
-- variables, pour éviter tout motif « new.id / new.email » qu'un clavier iPad
-- transforme en lien (.id, .email, .name sont des extensions de domaine).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
declare
  j          jsonb := to_jsonb(new);
  v_email    text  := j->>'email';
  v_uid      uuid  := (j->>'id')::uuid;
  v_meta     jsonb := coalesce(j->'raw_user_meta_data', '{}'::jsonb);
  v_allowed  boolean := false;
  v_found    boolean := false;
  v_gname    text;
  v_grole    jsonb;
  v_gcountry text;
  v_gint     text[];
  v_glook    jsonb;
  v_gevent   uuid;
begin
  -- (1) Allowlist : e-mail présent dans la liste importée (guests) ?
  begin
    select exists (
      select 1 from public.guests
      where email is not null and lower(email) = lower(v_email)
    ) into v_allowed;
  exception when undefined_table or undefined_column then v_allowed := false; end;

  -- … ou dans le journal des invitations envoyées (invites) ?
  if not v_allowed then
    begin
      select exists (
        select 1 from public.invites where lower(email) = lower(v_email)
      ) into v_allowed;
    exception when undefined_table or undefined_column then null; end;
  end if;

  if not v_allowed then
    raise exception 'OAF_NOT_INVITED';
  end if;

  -- (2) Fiche pré-chargée correspondant à cet e-mail ?
  begin
    select name, role, country, interests, looking_for, event_id
      into v_gname, v_grole, v_gcountry, v_gint, v_glook, v_gevent
    from public.guests
    where email is not null and lower(email) = lower(v_email)
    order by created_at limit 1;
    v_found := found;
  exception when undefined_column then v_found := false; end;

  insert into public.profiles (id, name, role, country, interests, looking_for, photo_url)
  values (
    v_uid,
    coalesce(v_meta->>'full_name', v_meta->>'name', v_gname, split_part(v_email, '@', 1)),
    coalesce(v_grole, jsonb_build_object('fr','','en','')),
    coalesce(v_gcountry, '🌍'),
    coalesce(v_gint, array[]::text[]),
    coalesce(v_glook, jsonb_build_object('fr','','en','')),
    coalesce(v_meta->>'avatar_url', v_meta->>'picture')
  )
  on conflict (id) do nothing;

  -- Rattachement automatique au forum de l'invité + retrait du doublon.
  if v_found then
    if v_gevent is not null then
      insert into public.event_attendees (event_id, profile_id)
      values (v_gevent, v_uid) on conflict do nothing;
    end if;
    delete from public.guests where email is not null and lower(email) = lower(v_email);
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- (OPTIONNEL) BACKFILL pilote — à exécuter SEULEMENT si tous vos membres actuels
-- appartiennent au forum « live ». Rattache les profils existants à cet événement
-- pour qu'ils se voient immédiatement dans l'annuaire cloisonné. Décommentez :
--
-- insert into public.event_attendees (event_id, profile_id)
-- select ev_id, prof_id
-- from (
--   select
--     (select id from public.events where status = 'live' order by created_at limit 1) as ev_id,
--     id as prof_id
--   from public.profiles
-- ) s
-- on conflict do nothing;

-- ----------------------------------------------------------------------------
-- Vérifications
-- ----------------------------------------------------------------------------
select policyname, cmd from pg_policies where schemaname='public' and tablename='profiles';
select proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.proname in ('shares_event','handle_new_user');

-- ########## supabase/messaging-safety.sql ##########

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

-- ########## supabase/perf-p0.sql ##########

-- ============================================================================
-- PERFORMANCE P0 — index + sécurité event_attendees (S1)
-- À exécuter UNE fois dans Supabase → SQL Editor → Run. Idempotent, sans risque.
--
--   • Index secondaires sur les tables « chaudes » (messages, event_attendees,
--     connections, questions, meetings) → lectures jusqu'à ~20× plus rapides.
--   • Resserre la lecture de event_attendees : on ne voit les inscriptions que
--     de SES forums (sécurité H1 cohérente), via une fonction SECURITY DEFINER
--     pour éviter toute récursion de politique.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) INDEX — tables toujours présentes
-- ----------------------------------------------------------------------------
create index if not exists messages_sender_created_idx
  on public.messages (sender, created_at desc);
create index if not exists messages_recipient_created_idx
  on public.messages (recipient, created_at desc);
create index if not exists event_attendees_profile_idx
  on public.event_attendees (profile_id);
create index if not exists connections_addressee_idx
  on public.connections (addressee, status);

-- ----------------------------------------------------------------------------
-- 2) INDEX — tables optionnelles (ignorées si absentes)
-- ----------------------------------------------------------------------------
do $$ begin
  execute 'create index if not exists questions_session_created_idx on public.questions (session_id, created_at desc)';
exception when undefined_table then null; end $$;

do $$ begin
  execute 'create index if not exists meetings_organizer_idx on public.meetings (organizer)';
  execute 'create index if not exists meetings_guest_idx on public.meetings (guest)';
exception when undefined_table or undefined_column then null; end $$;

-- ----------------------------------------------------------------------------
-- 3) event_attendees : lecture par tout utilisateur connecté.
--    NB : on N'utilise PAS de politique qui relit event_attendees (ex. via une
--    fonction is_my_event), car SECURITY DEFINER ne contourne PAS la RLS dans ce
--    projet => récursion infinie (« stack depth limit exceeded ») qui cassait
--    profiles/event_attendees/guests. Le cloisonnement de l'annuaire (H1) reste
--    assuré par les politiques de profiles et guests.
-- ----------------------------------------------------------------------------
drop policy if exists "ea_read" on public.event_attendees;
drop function if exists public.is_my_event(uuid);
create policy ea_read on public.event_attendees for select using (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- Vérifications
-- ----------------------------------------------------------------------------
select indexname from pg_indexes
where schemaname = 'public'
  and tablename in ('messages','event_attendees','connections','questions','meetings')
order by tablename, indexname;

-- ########## supabase/security-hardening.sql ##########

-- ============================================================================
-- DURCISSEMENT SÉCURITÉ — à exécuter UNE fois dans Supabase → SQL Editor → Run.
-- Idempotent : peut être ré-exécuté sans risque.
--
-- Corrige 3 points relevés à l'audit :
--   C1 — un participant pouvait s'auto-attribuer is_admin (escalade de privilèges)
--   M1 — les e-mails des invités (table guests) étaient lisibles par tous
--   M2 — fonctions SECURITY DEFINER sans search_path figé (lint Supabase)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- C1 — Empêcher la modification de la colonne is_admin par les utilisateurs.
-- On retire le droit d'UPDATE global sur profiles, puis on le re-donne colonne
-- par colonne SAUF is_admin (et id / created_at). La RLS continue de limiter à
-- « sa propre fiche ». La promotion organisateur reste possible depuis le SQL
-- Editor (rôle propriétaire), qui ignore ces droits.
-- ----------------------------------------------------------------------------
revoke update on public.profiles from anon, authenticated;
grant  update (name, role, company, country, photo_url,
               interests, looking_for, languages, is_visible)
       on public.profiles to authenticated;

-- ----------------------------------------------------------------------------
-- M1 — Ne plus exposer l'e-mail des invités côté app. On retire le SELECT global
-- sur guests et on le re-donne sans la colonne email. Le trigger handle_new_user
-- (SECURITY DEFINER) lit toujours l'email pour pré-remplir le profil : il
-- s'exécute avec les droits du propriétaire, donc non concerné par ce retrait.
-- ----------------------------------------------------------------------------
revoke select on public.guests from anon, authenticated;
grant  select (id, event_id, name, role, country, interests, looking_for, created_at)
       on public.guests to authenticated;

-- ----------------------------------------------------------------------------
-- M2 — Figer le search_path des fonctions sensibles (bonne pratique Supabase).
-- ALTER FUNCTION ne touche pas le corps : aucun risque de régression.
-- ----------------------------------------------------------------------------
alter function public.handle_new_user()  set search_path = public, pg_temp;
alter function public.is_admin()          set search_path = public, pg_temp;
-- (send_event_invites a déjà un search_path ; on le réaffirme par sécurité.)
do $$
begin
  if exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'send_event_invites'
  ) then
    execute 'alter function public.send_event_invites(text[], text, text, bigint, text)
             set search_path = public, net, vault, extensions';
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- Vérifications
-- ----------------------------------------------------------------------------
-- 1) Les droits d'écriture sur profiles ne doivent PAS inclure is_admin :
select grantee, privilege_type, column_name
from information_schema.column_privileges
where table_schema='public' and table_name='profiles' and privilege_type='UPDATE'
order by grantee, column_name;

-- 2) Les droits de lecture sur guests ne doivent PAS inclure email :
select grantee, privilege_type, column_name
from information_schema.column_privileges
where table_schema='public' and table_name='guests' and privilege_type='SELECT'
order by grantee, column_name;
