-- Permet à l'invité (guest) d'accepter/refuser un rendez-vous.
-- À coller dans Supabase → SQL Editor → Run (une fois).
drop policy if exists "meet_rw" on meetings;
create policy "meet_rw" on meetings for all
  using (organizer = auth.uid() or guest = auth.uid())
  with check (organizer = auth.uid() or guest = auth.uid());

-- (optionnel) rendre les RDV temps réel
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='meetings')
  then alter publication supabase_realtime add table meetings; end if;
end $$;
