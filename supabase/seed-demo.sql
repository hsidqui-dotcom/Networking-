-- ============================================================================
-- OAF Connect — contenu d'exemple (ROBUSTE)
-- Crée l'événement s'il manque, puis remplit le PREMIER événement.
-- Idempotent. À coller dans Supabase → SQL Editor → Run.
-- ============================================================================

-- 0) S'assurer qu'un événement existe
insert into events (name, city, city_short, status, dates, theme)
select 'OneAfrica Forum 2026','Kigali, Rwanda','Kigali','live',
       '{"fr":"12–14 juin 2026","en":"12–14 Jun 2026"}',
       '{"fr":"Business, Investissement & Leadership","en":"Business, Investment & Leadership"}'
where not exists (select 1 from events);

-- 1) PROGRAMME
with ev as (select id from events order by created_at limit 1)
insert into sessions (event_id, day, time, dur, color, title, room, track, description)
select (select id from ev), v.day, v.time, v.dur, v.color, v.title::jsonb, v.room::jsonb, v.track::jsonb, v.description::jsonb
from (values
 (0,'09:00','30m','#1E8C5A','{"fr":"Ouverture & bienvenue","en":"Opening & welcome"}','{"fr":"Grande scène","en":"Main Stage"}','{"fr":"Plénière","en":"Plenary"}','{"fr":"Le Président ouvre l’édition 2026.","en":"The Chair opens the 2026 forum."}'),
 (0,'09:30','60m','#111111','{"fr":"Keynote : financer la décennie de la ZLECAf","en":"Keynote: Financing the AfCFTA decade"}','{"fr":"Grande scène","en":"Main Stage"}','{"fr":"Investissement","en":"Investment"}','{"fr":"Capital public et privé pour la ZLECAf.","en":"Public and private capital for the AfCFTA."}'),
 (0,'11:00','45m','#1B998B','{"fr":"Agritech : débouchés & climat","en":"Agritech offtake & climate"}','{"fr":"Salle B","en":"Room B"}','{"fr":"Agritech","en":"Agritech"}','{"fr":"Modèles agritech bancables.","en":"Bankable agritech models."}'),
 (1,'10:30','45m','#1E8C5A','{"fr":"Transition énergétique & capital vert","en":"Energy transition & green capital"}','{"fr":"Salle A","en":"Room A"}','{"fr":"Énergie","en":"Energy"}','{"fr":"Financer la transition juste.","en":"Financing a just transition."}'),
 (1,'13:15','30m','#9a6b00','{"fr":"RDV express Agritech (IA)","en":"Agritech speed-meetings (AI)"}','{"fr":"Salle B","en":"Room B"}','{"fr":"Networking","en":"Networking"}','{"fr":"Vous + 7 délégués matchés.","en":"You + 7 matched delegates."}'),
 (2,'14:00','45m','#1E8C5A','{"fr":"Clôture & annonce Lagos","en":"Closing & Lagos reveal"}','{"fr":"Grande scène","en":"Main Stage"}','{"fr":"Plénière","en":"Plenary"}','{"fr":"Bilan et prochaine destination.","en":"Wrap-up and next destination."}')
) as v(day,time,dur,color,title,room,track,description)
where not exists (select 1 from sessions s where s.event_id = (select id from ev));

-- 2) INTERVENANTS
with ev as (select id from events order by created_at limit 1)
insert into speakers (event_id, name, role, country, color, bio, tags)
select (select id from ev), v.name, v.role::jsonb, v.country, v.color, v.bio::jsonb, v.tags::text[]
from (values
 ('Dr. Amara Okonkwo','{"fr":"Chef économiste · BAD","en":"Chief Economist · AfDB"}','🇳🇬','#E2622C','{"fr":"Économiste de référence sur la ZLECAf.","en":"Leading economist on the AfCFTA."}','{Trade,AfCFTA,Macro}'),
 ('Thabo Nkosi','{"fr":"CEO · Continental Energy","en":"CEO · Continental Energy"}','🇿🇦','#13476b','{"fr":"Plus grand producteur d’énergie renouvelable d’Afrique.","en":"Africa’s largest renewable IPP."}','{Energie,Climat}'),
 ('Fatou Ndiaye','{"fr":"Associée · Sahel Ventures","en":"Partner · Sahel Ventures"}','🇸🇳','#5b8def','{"fr":"Investisseuse early-stage en Afrique francophone.","en":"Early-stage investor across Francophone Africa."}','{VC,Agritech,Fintech}')
) as v(name,role,country,color,bio,tags)
where not exists (select 1 from speakers s where s.event_id = (select id from ev));

-- 3) PARTENAIRES
with ev as (select id from events order by created_at limit 1)
insert into sponsors (event_id, name, tier, color, description, booth)
select (select id from ev), v.name, v.tier, v.color, v.description::jsonb, v.booth::jsonb
from (values
 ('AfriBank Group','PLATINUM','#FFE400','{"fr":"Groupe bancaire panafricain.","en":"Pan-African banking group."}','{"fr":"Stand A1","en":"Booth A1"}'),
 ('Sahel Ventures','GOLD','#1B998B','{"fr":"VC early-stage francophone.","en":"Francophone early-stage VC."}','{"fr":"Stand B3","en":"Booth B3"}'),
 ('TerraConnect Telecom','SILVER','#5b8def','{"fr":"Partenaire connectivité.","en":"Connectivity partner."}','{"fr":"Stand C2","en":"Booth C2"}')
) as v(name,tier,color,description,booth)
where not exists (select 1 from sponsors s where s.event_id = (select id from ev));

-- 4) NOTIFICATION DE BIENVENUE
with ev as (select id from events order by created_at limit 1)
insert into notifications (event_id, icon, title)
select (select id from ev), '📣', '{"fr":"Bienvenue sur OAF Connect ! Le programme est en ligne.","en":"Welcome to OAF Connect! The program is live."}'::jsonb
where not exists (select 1 from notifications n where n.event_id = (select id from ev));

-- 5) RÉSULTAT (doit afficher 6 sessions, 3 intervenants, 3 partenaires)
select
  (select count(*) from sessions)      as sessions,
  (select count(*) from speakers)      as intervenants,
  (select count(*) from sponsors)      as partenaires,
  (select count(*) from notifications) as notifications,
  (select count(*) from events)        as evenements;
