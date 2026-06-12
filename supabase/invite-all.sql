-- ============================================================================
-- INVITER TOUS LES PARTICIPANTS IMPORTÉS — envoi en 1 clic depuis la console.
-- Les e-mails sont lus côté serveur (SECURITY DEFINER) : l'admin n'a rien à coller.
-- Pré-requis : secret Vault « resend_api_key » + domaine vérifié dans Resend.
-- À exécuter dans Supabase → SQL Editor → Run.
-- ============================================================================
create extension if not exists pg_net;

create or replace function public.invite_all_guests(
  p_event    uuid,
  app_url    text default 'https://app.oneafricaforums.com/app/',
  from_email text default 'One Africa Forums <no-reply@send.oneafricaforums.com>'
) returns json
language plpgsql security definer
set search_path = public, net, vault, extensions
as $$
declare
  v_key   text;
  v_name  text;
  v_html  text;
  r       record;
  v_count int := 0;
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and is_admin) then
    raise exception 'Réservé aux organisateurs.';
  end if;

  select decrypted_secret into v_key from vault.decrypted_secrets where name = 'resend_api_key';
  if v_key is null then
    raise exception 'Clé Resend introuvable. Créez le secret « resend_api_key ».';
  end if;

  select name into v_name from public.events where id = p_event;
  v_name := coalesce(v_name, 'One Africa Forums');

  for r in
    select distinct lower(trim(email)) as email
    from public.guests
    where event_id = p_event and email is not null and position('@' in email) > 1
  loop
    v_html := format(
      '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;color:#111">'
      '<h2 style="margin:0 0 8px">Votre accès à l''app de networking — %1$s</h2>'
      '<p style="font-size:15px;line-height:1.55">Bonjour,<br>Vous êtes convié·e à utiliser '
      '<b>OAF Connect</b>, l''application de networking de One Africa Forums pour <b>%1$s</b> : '
      'programme et intervenants, annuaire des participants avec correspondances, messagerie et '
      'rendez-vous 1:1, partenaires.</p>'
      '<p style="margin:24px 0"><a href="%2$s" style="background:#F2E500;color:#111;'
      'padding:13px 26px;border-radius:10px;text-decoration:none;font-weight:700;'
      'display:inline-block">Ouvrir l''application</a></p>'
      '<p style="font-size:14px;line-height:1.55"><b>Connexion en 30 secondes</b>, avec '
      '<b>cette adresse e-mail</b> :<br>• « Continuer avec Google », ou<br>'
      '• « Recevoir un code » → un code arrive par e-mail → vous le saisissez.</p>'
      '<p style="color:#777;font-size:12px">Lien : <a href="%2$s">%2$s</a></p>'
      '<p style="color:#aaa;font-size:11px">One Africa Forums — « Empowering South-South cooperation »</p>'
      '</div>', v_name, app_url);

    perform net.http_post(
      url     := 'https://api.resend.com/emails',
      headers := jsonb_build_object('Authorization', 'Bearer ' || v_key, 'Content-Type', 'application/json'),
      body    := jsonb_build_object('from', from_email, 'to', r.email,
                   'subject', 'Votre accès — ' || v_name, 'html', v_html)
    );
    insert into public.invites(email, sent_by) values (r.email, auth.uid());
    v_count := v_count + 1;
  end loop;

  return json_build_object('sent', v_count);
end;
$$;

revoke all on function public.invite_all_guests(uuid, text, text) from public, anon;
grant execute on function public.invite_all_guests(uuid, text, text) to authenticated;

select 'invite_all_guests OK' as resultat;
