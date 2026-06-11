-- ============================================================================
-- PARTENAIRES ENRICHIS (module sponsors premium) — Phase A : base de données
-- À exécuter UNE fois dans Supabase → SQL Editor → Run. Idempotent, sans risque.
-- ============================================================================

-- 1) Champs éditoriaux / liens / ordre / premium sur la fiche partenaire.
alter table public.sponsors add column if not exists website     text;
alter table public.sponsors add column if not exists linkedin    text;
alter table public.sponsors add column if not exists brochure_url text;
alter table public.sponsors add column if not exists video_url   text;
alter table public.sponsors add column if not exists sort_order  int default 0;
alter table public.sponsors add column if not exists featured    boolean default false;

-- 2) Contacts du partenaire (plusieurs par partenaire).
create table if not exists public.sponsor_contacts (
  id         uuid primary key default uuid_generate_v4(),
  sponsor_id uuid references public.sponsors(id) on delete cascade,
  name       text not null,
  role       text default '',
  email      text default '',
  phone      text default '',
  linkedin   text default '',
  photo_url  text,
  sort_order int default 0,
  created_at timestamptz default now()
);
create index if not exists sponsor_contacts_sponsor_idx on public.sponsor_contacts (sponsor_id);

-- 3) Sécurité : lecture par les connectés, écriture réservée à l'admin.
alter table public.sponsor_contacts enable row level security;
drop policy if exists sponsor_contacts_read  on public.sponsor_contacts;
drop policy if exists sponsor_contacts_admin on public.sponsor_contacts;
create policy sponsor_contacts_read  on public.sponsor_contacts for select using (auth.role() = 'authenticated');
create policy sponsor_contacts_admin on public.sponsor_contacts for all    using (public.is_admin()) with check (public.is_admin());

-- 4) Temps réel (la fiche partenaire se met à jour en direct).
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='sponsor_contacts')
  then alter publication supabase_realtime add table sponsor_contacts; end if;
end $$;

select 'sponsors + sponsor_contacts OK' as resultat;
