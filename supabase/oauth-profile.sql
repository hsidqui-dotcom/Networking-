-- Récupère le NOM et la PHOTO depuis Google / LinkedIn à la première connexion
-- (comme Whova) ET conserve la mécanique « profil pré-rempli » (preload-claim).
-- NOTE : cette fonction est désormais IDENTIQUE à celle de preload-claim.sql
-- (elle gère déjà nom + photo via avatar_url/picture). Vous n'avez donc rien à
-- ré-exécuter si preload-claim.sql a déjà été appliqué. Conservé pour référence.
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
declare g public.guests%rowtype;
begin
  select * into g
  from public.guests
  where email is not null and lower(email) = lower(new.email)
  order by created_at
  limit 1;

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
