-- Donne les droits ORGANISATEUR (admin) à un compte.
-- Pré-requis : la personne doit s'être connectée AU MOINS UNE FOIS à l'app
-- (par email/Google/LinkedIn) pour que son profil existe.
-- Remplacez l'adresse ci-dessous, puis exécutez dans Supabase → SQL Editor.

update public.profiles
set is_admin = true
where id = (select id from auth.users where email = 'hsidqui@oneafricaforums.com');

-- Vérification : doit afficher votre ligne avec is_admin = true
select p.id, u.email, p.name, p.is_admin
from public.profiles p
join auth.users u on u.id = p.id
where u.email = 'hsidqui@oneafricaforums.com';
