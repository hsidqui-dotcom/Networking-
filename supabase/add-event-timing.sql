-- Real start/end timestamps so the app can compute an event's status
-- (upcoming / live / past) automatically from the current time.
-- auto_status = true  -> status is derived from starts_at/ends_at
-- auto_status = false -> the manual `status` column is used (override)
-- Safe to run multiple times.
alter table events add column if not exists starts_at   timestamptz;
alter table events add column if not exists ends_at     timestamptz;
alter table events add column if not exists auto_status boolean default false;
