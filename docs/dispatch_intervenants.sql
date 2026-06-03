-- ============================================================================
-- APF 2026 — Dispatch automatique des intervenants & modérateurs par séance
-- À coller dans Supabase -> SQL Editor -> Run  (le message "destructive" est normal)
-- Sans risque : ajoute les liens, "on conflict do nothing" préserve vos ajouts.
-- ============================================================================

-- Helper anti-accents (sans extension)
create or replace function _noacc(t text) returns text language sql immutable as $$
  select translate(lower(coalesce(t,'')), 'àâäáãéèêëíìîïóòôöõúùûüçñ', 'aaaaaeeeeiiiiooooouuuucn');
$$;

-- 1) Affecter les intervenants détectés dans les descriptions des séances
insert into session_speakers (session_id, speaker_id, role)
select s.id, sp.id, 'speaker'
from sessions s
join speakers sp on sp.event_id = s.event_id
where char_length(regexp_replace(sp.name,'^(Hon\.?|Dr|Col\.?|Mme|M\.)\s+','','i')) > 4
  and _noacc(coalesce(s.description->>'fr','')||' '||coalesce(s.description->>'en',''))
      like '%'||_noacc(regexp_replace(sp.name,'^(Hon\.?|Dr|Col\.?|Mme|M\.)\s+','','i'))||'%'
on conflict (session_id, speaker_id) do nothing;

-- 2) Marquer le modérateur (nom situé après "Modérateur" dans la description FR)
update session_speakers ss set role='moderator'
from sessions s, speakers sp
where ss.session_id=s.id and ss.speaker_id=sp.id
  and position('moderateur' in _noacc(s.description->>'fr')) > 0
  and position(_noacc(regexp_replace(sp.name,'^(Hon\.?|Dr|Col\.?|Mme|M\.)\s+','','i')) in _noacc(s.description->>'fr'))
      > position('moderateur' in _noacc(s.description->>'fr'));

-- Nettoyage
drop function _noacc(text);
