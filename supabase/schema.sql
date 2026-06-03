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
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
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
  cover_url text, created_at timestamptz default now()
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

create or replace function is_admin()
returns boolean language sql stable as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
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
  using (requester = auth.uid() or addressee = auth.uid()) with check (requester = auth.uid());
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
  role jsonb default '{"fr":"","en":""}',
  country text default '🌍',
  interests text[] default '{}',
  looking_for jsonb default '{"fr":"","en":""}',
  created_at timestamptz default now()
);
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
