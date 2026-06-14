-- ============================================================================
-- STATISTIQUES D'ÉVÉNEMENT (pilotage admin) — agrégats sécurisés.
-- À exécuter UNE fois dans Supabase → SQL Editor → Run. Idempotent.
--
-- event_stats(p_event) : renvoie un JSON de compteurs pour le forum donné.
--   • Réservé aux admins (is_admin()).
--   • SECURITY DEFINER : nécessaire pour COMPTER à travers tous les participants
--     (la RLS masque, à juste titre, les connexions/RDV/messages d'autrui).
--   • Ne renvoie QUE des nombres agrégés — aucun contenu privé n'est exposé.
-- ============================================================================

create or replace function public.event_stats(p_event uuid)
returns json
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_joined int; v_pending int; v_complete int;
  v_conn int; v_conn_ok int;
  v_meet int; v_meet_ok int; v_meet_pend int; v_meet_dec int;
  v_msg int; v_active int;
  v_sessions int; v_bk int; v_q int; v_qv int;
  v_speakers int; v_sponsors int; v_top json;
begin
  if not public.is_admin() then raise exception 'OAF_NOT_ADMIN'; end if;

  -- ADOPTION
  select count(*) into v_joined  from public.event_attendees where event_id = p_event;
  select count(*) into v_pending from public.guests          where event_id = p_event;
  select count(*) into v_complete
    from public.event_attendees a join public.profiles p on p.id = a.profile_id
    where a.event_id = p_event
      and coalesce(p.name,'') <> ''
      and coalesce(p.role->>'fr', p.role->>'en', '') <> '';

  -- NETWORKING (connexions : les DEUX parties inscrites à ce forum)
  select count(*), count(*) filter (where c.status = 'accepted')
    into v_conn, v_conn_ok
    from public.connections c
    where exists (select 1 from public.event_attendees a where a.profile_id = c.requester and a.event_id = p_event)
      and exists (select 1 from public.event_attendees b where b.profile_id = c.addressee and b.event_id = p_event);

  select count(*),
         count(*) filter (where status = 'confirmed'),
         count(*) filter (where status = 'pending'),
         count(*) filter (where status = 'declined')
    into v_meet, v_meet_ok, v_meet_pend, v_meet_dec
    from public.meetings where event_id = p_event;

  select count(*) into v_msg
    from public.messages m
    where exists (select 1 from public.event_attendees a where a.profile_id = m.sender and a.event_id = p_event);

  -- Participants actifs (>= 1 interaction) parmi les inscrits du forum
  select count(*) into v_active from (
    select a.profile_id
    from public.event_attendees a
    where a.event_id = p_event and (
         exists (select 1 from public.connections c where c.requester = a.profile_id or c.addressee = a.profile_id)
      or exists (select 1 from public.messages   m where m.sender   = a.profile_id or m.recipient = a.profile_id)
      or exists (select 1 from public.meetings   t where t.event_id = p_event and (t.organizer = a.profile_id or t.guest = a.profile_id))
      or exists (select 1 from public.bookmarks  b join public.sessions s on s.id = b.session_id where b.profile_id = a.profile_id and s.event_id = p_event)
    )
  ) sub;

  -- PROGRAMME & Q&A
  select count(*) into v_sessions from public.sessions where event_id = p_event;
  select count(*) into v_bk from public.bookmarks b join public.sessions s on s.id = b.session_id where s.event_id = p_event;
  select count(*) into v_q  from public.questions where event_id = p_event;
  select count(*) into v_qv from public.question_votes qv join public.questions q on q.id = qv.question_id where q.event_id = p_event;

  select coalesce(json_agg(row_to_json(x)), '[]'::json) into v_top from (
    select coalesce(s.title->>'fr', s.title->>'en', '—') as title, count(b.profile_id) as n
    from public.sessions s left join public.bookmarks b on b.session_id = s.id
    where s.event_id = p_event
    group by s.id, s.title
    having count(b.profile_id) > 0
    order by n desc limit 3
  ) x;

  -- CONTENU
  select count(*) into v_speakers from public.speakers where event_id = p_event;
  select count(*) into v_sponsors from public.sponsors where event_id = p_event;

  return json_build_object(
    'joined', v_joined, 'pending_import', v_pending, 'profiles_complete', v_complete,
    'connections', v_conn, 'connections_accepted', v_conn_ok,
    'meetings', v_meet, 'meetings_confirmed', v_meet_ok, 'meetings_pending', v_meet_pend, 'meetings_declined', v_meet_dec,
    'messages', v_msg, 'active', v_active,
    'sessions', v_sessions, 'bookmarks', v_bk, 'questions', v_q, 'question_votes', v_qv,
    'speakers', v_speakers, 'sponsors', v_sponsors, 'top_sessions', v_top
  );
end;
$$;
grant execute on function public.event_stats(uuid) to authenticated;

select 'event_stats OK' as resultat;
