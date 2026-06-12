-- ============================================================================
-- INVITATIONS PERSONNALISÉES (nominatives) — version avec MODE TEST (p_only).
-- p_only renseigné  -> envoie UNIQUEMENT à cette adresse (aperçu, sans spammer).
-- p_only null        -> envoie à TOUS les participants importés du forum.
-- À exécuter dans Supabase → SQL Editor → Run.
-- ============================================================================
drop function if exists public.invite_event_guests(uuid, text, text);

create or replace function public.invite_event_guests(
  p_event    uuid,
  app_url    text default 'https://app.oneafricaforums.com/app/',
  from_email text default 'One Africa Forums <no-reply@send.oneafricaforums.com>',
  p_only     text default null
) returns json
language plpgsql security definer
set search_path = public, net, vault, extensions
as $$
declare
  v_key text; v_name text; v_greet text; v_html text; r record; v_count int := 0;
  v_only text := lower(trim(coalesce(p_only,'')));
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and is_admin) then
    raise exception 'Reserve aux organisateurs.';
  end if;
  select decrypted_secret into v_key from vault.decrypted_secrets where name = 'resend_api_key';
  if v_key is null then raise exception 'Cle Resend introuvable.'; end if;
  select name into v_name from public.events where id = p_event;
  v_name := coalesce(v_name, 'One Africa Forums');

  for r in
    with base as (
      select distinct on (lower(trim(email))) name as gname, lower(trim(email)) as gmail
      from public.guests
      where event_id = p_event and email is not null and position('@' in email) > 1
    )
    select gname, gmail from base where v_only = '' or gmail = v_only
    union all
    select null::text, v_only where v_only <> '' and not exists (select 1 from base where gmail = v_only)
  loop
    v_greet := case when nullif(trim(coalesce(r.gname,'')),'') is null
                    then 'Bonjour' else 'Bonjour ' || split_part(trim(r.gname),' ',1) end;
    v_html := format($html$<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;color:#1a1a1a">
  <div style="background:#F2E500;padding:16px 22px;border-radius:14px 14px 0 0"><b style="font-size:18px">One Africa Forums - OAF Connect</b></div>
  <div style="border:1px solid #eee;border-top:0;border-radius:0 0 14px 14px;padding:22px">
    <p style="font-size:16px;margin:0 0 12px">%1$s,</p>
    <p style="font-size:15px;line-height:1.6;margin:0 0 16px">Vous êtes convié·e à utiliser <b>OAF Connect</b>, l'application de networking de <b>%2$s</b> : programme &amp; intervenants, annuaire des participants, messagerie et rendez-vous 1:1, et partenaires.</p>
    <p style="text-align:center;margin:22px 0"><a href="%3$s" style="background:#111;color:#fff;padding:14px 30px;border-radius:10px;text-decoration:none;font-weight:700;display:inline-block">Ouvrir l'application</a></p>
    <p style="font-size:14px;line-height:1.6;margin:0 0 6px"><b>1) Se connecter (30 secondes)</b><br>Avec <b>cette adresse e-mail</b> : Continuer avec Google, ou Recevoir un code par e-mail (vous le saisissez).</p>
    <div style="background:#f7f7f7;border-radius:12px;padding:14px 16px;font-size:13.5px;line-height:1.65;margin:14px 0">
      <b>2) Installer l'app sur votre téléphone</b> :<br>
      <b>iPhone (Safari)</b> : ouvrez le lien, bouton Partager (carré avec flèche), puis « Sur l'écran d'accueil ».<br>
      <b>Android (Chrome)</b> : ouvrez le lien, menu (trois points), puis « Installer l'application ».
    </div>
    <p style="font-size:13px;color:#666;margin:6px 0 0">Lien direct : <a href="%3$s">%3$s</a></p>
    <p style="color:#999;font-size:11px;margin-top:18px">One Africa Forums</p>
  </div>
</div>$html$, v_greet, v_name, app_url);
    perform net.http_post(
      url := 'https://api.resend.com/emails',
      headers := jsonb_build_object('Authorization','Bearer '||v_key,'Content-Type','application/json'),
      body := jsonb_build_object('from',from_email,'to',r.gmail,'subject','Votre acces a OAF Connect - '||v_name,'html',v_html)
    );
    v_count := v_count + 1;
  end loop;

  return json_build_object('sent', v_count);
end;
$$;

grant execute on function public.invite_event_guests(uuid, text, text, text) to authenticated;
select 'invite_event_guests (avec mode test) OK' as resultat;
