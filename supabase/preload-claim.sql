-- ============================================================================
-- PROFILS PRÉ-REMPLIS « À RÉCLAMER » (effet Whova)
-- Quand un participant pré-chargé se connecte avec son e-mail, son profil est
-- rempli depuis la liste importée et le doublon « invité » disparaît.
--
-- ⚠️ La logique du trigger handle_new_user() a ÉTÉ DÉPLACÉE vers la version
-- canonique et sécurisée : supabase/access-control.sql (qui ajoute l'allowlist
-- « inscription sur invitation » H2 + le rattachement automatique au forum).
-- NE REDÉFINISSEZ PLUS handle_new_user() ici : cela désactiverait H2.
--
-- Ce fichier ne conserve que l'ajout de la colonne e-mail (idempotent, sûr).
-- ============================================================================

-- Ajoute l'e-mail (optionnel) aux participants pré-chargés + index de recherche.
alter table public.guests add column if not exists email text;
create index if not exists guests_email_idx on public.guests (lower(email));
