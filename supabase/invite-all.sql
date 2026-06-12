-- ============================================================================
-- INVITER TOUS LES PARTICIPANTS IMPORTÉS — récupère les e-mails côté serveur.
-- (L'envoi réutilise la fonction send_event_invites déjà en place.)
-- À exécuter dans Supabase → SQL Editor → Run.
-- ============================================================================
create or replace function public.guest_emails(p_event uuid)
returns text[]
language sql stable security definer set search_path = public, pg_temp as $$
  select coalesce(array_agg(distinct lower(trim(email))), array[]::text[])
  from public.guests
  where event_id = p_event
    and email is not null and position('@' in email) > 1
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin);
$$;

revoke all on function public.guest_emails(uuid) from public, anon;
grant execute on function public.guest_emails(uuid) to authenticated;

select 'guest_emails OK' as resultat;
