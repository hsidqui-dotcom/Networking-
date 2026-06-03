-- ============================================================================
-- PROFILS PRÉ-REMPLIS « À RÉCLAMER » (effet Whova) — éditeur SQL Supabase
-- Quand un participant pré-chargé se connecte avec son e-mail, son profil est
-- automatiquement rempli (fonction, pays, intérêts) depuis la liste importée,
-- et le doublon « invité » disparaît. Exécutez ce fichier dans SQL Editor.
-- ============================================================================

-- 1) Ajoute l'e-mail (optionnel) aux participants pré-chargés.
alter table public.guests add column if not exists email text;
create index if not exists guests_email_idx on public.guests (lower(email));

-- 2) À la première connexion : on relie l'invité à son nouveau profil.
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

  -- Le participant « réclame » sa fiche : on retire le doublon de la liste invités.
  if g.id is not null then
    delete from public.guests where id = g.id;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function handle_new_user();
