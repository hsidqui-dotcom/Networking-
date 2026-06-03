-- Practical info for each event (venue, address, wifi, contacts, notes…)
-- Shown in the participant app under the "Infos pratiques" tile.
-- Safe to run multiple times.
alter table events add column if not exists info jsonb default '{}'::jsonb;
