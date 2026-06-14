-- ============================================================================
-- ÉQUIPE / ADMINISTRATEURS — gestion self-service depuis la console.
-- À exécuter UNE fois dans Supabase → SQL Editor → Run. Idempotent.
--
--   set_admin(email, valeur)  : promeut (true) ou retire (false) un admin.
--       • Réservé aux admins (is_admin()).
--       • Impossible de retirer SES PROPRES droits (anti-verrouillage).
--       • S'exécute en SECURITY DEFINER → contourne le verrou de colonne
--         is_admin (C1) en toute sécurité, car protégé par is_admin().
--   list_admins()             : liste les admins (avec e-mail), réservé aux admins.
-- ============================================================================

create or replace function public.set_admin(p_email text, p_value boolean)
returns json
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_id uuid; v_n int;
begin
  if not public.is_admin() then raise exception 'OAF_NOT_ADMIN'; end if;
  select id into v_id from auth.users where lower(email) = lower(trim(p_email)) limit 1;
  if v_id is null then raise exception 'OAF_NO_USER'; end if;
  if p_value = false and v_id = auth.uid() then raise exception 'OAF_SELF'; end if;
  update public.profiles set is_admin = p_value where id = v_id;
  get diagnostics v_n = row_count;
  if v_n = 0 then raise exception 'OAF_NO_PROFILE'; end if;
  return json_build_object('ok', true);
end;
$$;
grant execute on function public.set_admin(text, boolean) to authenticated;

create or replace function public.list_admins()
returns table(id uuid, email text, name text)
language sql security definer set search_path = public, pg_temp as $$
  select p.id, u.email, p.name
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.is_admin = true and public.is_admin()
  order by u.email;
$$;
grant execute on function public.list_admins() to authenticated;

select 'admin-team (set_admin + list_admins) OK' as resultat;
