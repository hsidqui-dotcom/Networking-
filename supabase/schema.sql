-- ============================================================================
-- OAF Connect — schéma de production (Supabase / PostgreSQL)
-- À exécuter dans Supabase → SQL Editor (voir supabase/README.md).
-- Inclut : tables, sécurité au niveau des lignes (RLS), et données d'exemple.
-- ============================================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- PROFILS (1 ligne par utilisateur authentifié)
-- ----------------------------------------------------------------------------
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null default '',
  role        jsonb default '{"fr":"","en":""}',   -- fonction · société
  company     text default '',
  country     text default '🌍',
  photo_url   text,
  interests   text[] default '{}',
  looking_for jsonb default '{"fr":"","en":""}',
  languages   text[] default '{fr,en}',
  is_visible  boolean default true,                -- opt-in networking (RGPD)
  is_admin    boolean default false,               -- accès espace organisateur
  created_at  timestamptz default now()
);

-- Crée automatiquement un profil à l'inscription
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)));
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
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  city       text default '',
  city_short text default '',
  status     text default 'upcoming' check (status in ('live','upcoming','past')),
  dates      jsonb default '{"fr":"","en":""}',
  theme      jsonb default '{"fr":"","en":""}',
  cover_url  text,
  created_at timestamptz default now()
);

create table if not exists sessions (
  id          uuid primary key default uuid_generate_v4(),
  event_id    uuid references events(id) on delete cascade,
  day         int default 0,
  time        text default '12:00',
  dur         text default '45m',
  title       jsonb default '{"fr":"","en":""}',
  room        jsonb default '{"fr":"","en":""}',
  track       jsonb default '{"fr":"","en":""}',
  description jsonb default '{"fr":"","en":""}',
  color       text default '#5b8def',
  created_at  timestamptz default now()
);

create table if not exists speakers (
  id        uuid primary key default uuid_generate_v4(),
  event_id  uuid references events(id) on delete cascade,
  name      text not null,
  role      jsonb default '{"fr":"","en":""}',
  country   text default '🌍',
  photo_url text,
  bio       jsonb default '{"fr":"","en":""}',
  tags      text[] default '{}'
);

create table if not exists sponsors (
  id          uuid primary key default uuid_generate_v4(),
  event_id    uuid references events(id) on delete cascade,
  name        text not null,
  tier        text default 'SILVER',
  logo_url    text,
  description jsonb default '{"fr":"","en":""}',
  booth       jsonb default '{"fr":"","en":""}',
  color       text default '#5b8def'
);

-- Qui participe à quel événement
create table if not exists event_attendees (
  event_id   uuid references events(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (event_id, profile_id)
);

-- ----------------------------------------------------------------------------
-- NETWORKING : connexions, messages, RDV, favoris
-- ----------------------------------------------------------------------------
create table if not exists connections (
  id         uuid primary key default uuid_generate_v4(),
  requester  uuid references profiles(id) on delete cascade,
  addressee  uuid references profiles(id) on delete cascade,
  status     text default 'pending' check (status in ('pending','accepted','declined')),
  created_at timestamptz default now(),
  unique (requester, addressee)
);

create table if not exists messages (
  id         uuid primary key default uuid_generate_v4(),
  sender     uuid references profiles(id) on delete cascade,
  recipient  uuid references profiles(id) on delete cascade,
  body       text not null,
  read_at    timestamptz,
  created_at timestamptz default now()
);

create table if not exists meetings (
  id         uuid primary key default uuid_generate_v4(),
  event_id   uuid references events(id) on delete cascade,
  organizer  uuid references profiles(id) on delete cascade,
  guest      uuid references profiles(id) on delete cascade,
  slot       timestamptz,
  location   text,
  status     text default 'pending' check (status in ('pending','confirmed','declined')),
  created_at timestamptz default now()
);

create table if not exists bookmarks (
  profile_id uuid references profiles(id) on delete cascade,
  session_id uuid references sessions(id) on delete cascade,
  primary key (profile_id, session_id)
);

-- ----------------------------------------------------------------------------
-- NOTIFICATIONS (diffusées par l'organisateur)
-- ----------------------------------------------------------------------------
create table if not exists notifications (
  id         uuid primary key default uuid_generate_v4(),
  event_id   uuid references events(id) on delete cascade,
  icon       text default '🔔',
  title      jsonb default '{"fr":"","en":""}',
  created_at timestamptz default now()
);

-- ============================================================================
-- SÉCURITÉ (Row Level Security)
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

-- Helper : l'utilisateur courant est-il admin ?
create or replace function is_admin()
returns boolean language sql stable as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$;

-- PROFILS : on voit les profils visibles ; on modifie le sien ; admin voit tout
create policy "profiles_read"   on profiles for select using (is_visible or id = auth.uid() or is_admin());
create policy "profiles_update" on profiles for update using (id = auth.uid());

-- CONTENU PUBLIC (lecture pour tout authentifié ; écriture réservée aux admins)
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

-- PARTICIPATION
create policy "ea_read"   on event_attendees for select using (auth.role() = 'authenticated');
create policy "ea_self"   on event_attendees for insert with check (profile_id = auth.uid());
create policy "ea_admin"  on event_attendees for all using (is_admin()) with check (is_admin());

-- DONNÉES PERSONNELLES (chacun ne voit que les siennes)
create policy "conn_rw" on connections for all
  using (requester = auth.uid() or addressee = auth.uid())
  with check (requester = auth.uid());

create policy "msg_read"  on messages for select using (sender = auth.uid() or recipient = auth.uid());
create policy "msg_send"  on messages for insert with check (sender = auth.uid());

create policy "meet_rw" on meetings for all
  using (organizer = auth.uid() or guest = auth.uid())
  with check (organizer = auth.uid());

create policy "bm_rw" on bookmarks for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- Temps réel (chat + notifications)
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table connections;

-- ============================================================================
-- DONNÉES D'EXEMPLE (à supprimer en production)
-- ============================================================================
insert into events (name, city, city_short, status, dates, theme) values
  ('OneAfrica Forum 2026','Kigali, Rwanda','Kigali','live',
   '{"fr":"12–14 juin 2026","en":"12–14 Jun 2026"}',
   '{"fr":"Business, Investissement & Leadership","en":"Business, Investment & Leadership"}')
on conflict do nothing;

-- Pour devenir admin : connectez-vous une fois dans l'app, puis exécutez
--   update profiles set is_admin = true where id = (select id from auth.users where email = 'VOTRE_EMAIL');
