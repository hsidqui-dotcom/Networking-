-- ============================================================================
-- INVITATIONS PAR E-MAIL (via Resend) — déployable 100 % depuis l'éditeur SQL
-- Aucun ordinateur / CLI requis. Exécutez ce fichier dans Supabase → SQL Editor.
-- ============================================================================

-- 1) Extension HTTP (appels sortants depuis la base). Pré-installée sur Supabase.
create extension if not exists pg_net;

-- 2) Enregistrez votre clé API Resend comme SECRET (à faire UNE fois).
--    Récupérez-la sur resend.com → API Keys. Décommentez et remplacez la valeur :
-- select vault.create_secret('re_VOTRE_CLE_ICI', 'resend_api_key');
--
--    Pour la mettre à jour plus tard :
-- select vault.update_secret(
--   (select id from vault.secrets where name = 'resend_api_key'),
--   're_NOUVELLE_CLE');

-- 3) Journal des invitations envoyées.
create table if not exists public.invites (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  event_id   bigint,
  sent_by    uuid references auth.users(id),
  created_at timestamptz default now()
);
alter table public.invites enable row level security;
drop policy if exists "admins read invites" on public.invites;
create policy "admins read invites" on public.invites
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- 4) Fonction appelée par l'espace organisateur.
create or replace function public.send_event_invites(
  emails     text[],
  event_name text default 'OneAfricaForums',
  app_url    text default 'https://oneafricaforums.com',
  event_id   bigint default null,
  from_email text default 'OneAfricaForums <onboarding@resend.dev>'
) returns json
language plpgsql
security definer
set search_path = public, net, vault, extensions
as $$
declare
  v_key   text;
  v_email text;
  v_html  text;
  v_count int := 0;
begin
  -- Réservé aux organisateurs
  if not exists (select 1 from public.profiles where id = auth.uid() and is_admin) then
    raise exception 'Réservé aux organisateurs.';
  end if;

  select decrypted_secret into v_key
  from vault.decrypted_secrets where name = 'resend_api_key';
  if v_key is null then
    raise exception 'Clé Resend introuvable. Créez le secret « resend_api_key » (voir étape 2).';
  end if;

  foreach v_email in array emails loop
    v_email := lower(trim(v_email));
    continue when v_email = '' or v_email !~ '@';

    v_html := format(
      '<div style="font-family:Arial,Helvetica,sans-serif;max-width:540px;margin:auto;color:#111">'
      '<h2 style="margin:0 0 6px">Vous êtes invité·e à %1$s 🌍</h2>'
      '<p style="font-size:15px;line-height:1.5">Rejoignez l''application de networking '
      '<b>OneAfricaForums</b> : découvrez le programme, repérez les bons contacts grâce aux '
      'correspondances, et organisez vos rendez-vous 1:1.</p>'
      '<p style="margin:26px 0"><a href="%2$s" style="background:#F2E500;color:#111;'
      'padding:13px 24px;border-radius:10px;text-decoration:none;font-weight:700;'
      'display:inline-block">Ouvrir l''application</a></p>'
      '<p style="color:#777;font-size:12px">Connectez-vous avec cette adresse e-mail '
      '(code à usage unique) ou via Google / LinkedIn.</p>'
      '<p style="color:#aaa;font-size:11px">OneAfricaForums — « Empowering South-South cooperation »</p>'
      '</div>', event_name, app_url);

    perform net.http_post(
      url     := 'https://api.resend.com/emails',
      headers := jsonb_build_object(
                   'Authorization', 'Bearer ' || v_key,
                   'Content-Type',  'application/json'),
      body    := jsonb_build_object(
                   'from',    from_email,
                   'to',      v_email,
                   'subject', 'Invitation — ' || event_name,
                   'html',    v_html)
    );

    insert into public.invites(email, event_id, sent_by)
    values (v_email, event_id, auth.uid());
    v_count := v_count + 1;
  end loop;

  return json_build_object('sent', v_count);
end;
$$;

-- Seuls les utilisateurs connectés peuvent l'appeler (le contrôle admin est dans la fonction).
revoke all on function public.send_event_invites(text[], text, text, bigint, text) from public, anon;
grant execute on function public.send_event_invites(text[], text, text, bigint, text) to authenticated;
