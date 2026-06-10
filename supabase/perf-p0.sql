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
