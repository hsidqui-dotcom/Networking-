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
