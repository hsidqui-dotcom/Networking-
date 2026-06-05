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
