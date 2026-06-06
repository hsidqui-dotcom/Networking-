# 🔥 Stress test — OAF Connect

Objectif : valider que l'app tient **jusqu'à ~1500 participants connectés** (lectures
annuaire + connexions temps réel + envois de messages), avec des critères de réussite
mesurables.

> ⚠️ **RÈGLE D'OR : on stresse un projet Supabase de _staging_, JAMAIS la production.**
> Un stress test crée des centaines d'utilisateurs et des milliers de requêtes : sur la
> prod il polluerait les données, déclencherait des limites et pourrait coûter cher.

---

## 0. Pré-requis (sur un ordinateur, pas l'iPad)
- **Node.js 18+** : https://nodejs.org
- **k6** (outil de charge) : https://k6.io/docs/get-started/installation/
  - macOS : `brew install k6`
  - Windows : `winget install k6` (ou `choco install k6`)

---

## 1. Créer le projet de STAGING (≈ 10 min)
1. Sur https://supabase.com → **New project** (nomme-le `oaf-staging`, même région que la prod).
2. Dans **SQL Editor**, exécute, **dans cet ordre**, le contenu de ces fichiers du dépôt :
   1. `supabase/schema.sql`
   2. `supabase/access-control.sql`
   3. `supabase/messaging-safety.sql`
   4. `supabase/perf-p0.sql`
   5. (optionnels) `supabase/invitations.sql`, `supabase/add-event-info.sql`, `supabase/add-event-timing.sql`
   6. `supabase/security-hardening.sql`
3. Récupère, dans **Project Settings → API** :
   - `Project URL`  → `STAGING_URL`
   - clé `anon` `public` → `STAGING_ANON_KEY`
   - clé `service_role` `secret` → `STAGING_SERVICE_ROLE` (⚠️ secrète, ne jamais committer)

---

## 2. Générer les utilisateurs de test + leurs jetons
```bash
cd tests/stress
npm install
export STAGING_URL="https://xxxx.supabase.co"
export STAGING_ANON_KEY="..."
export STAGING_SERVICE_ROLE="..."
export N_USERS=1500          # nombre d'utilisateurs de test à créer
node setup-staging.mjs
```
Ce script :
- crée un **événement de test**,
- pré-charge `N_USERS` e-mails dans `guests` (pour passer l'allowlist H2),
- crée les comptes (le trigger les rattache automatiquement au forum),
- se connecte à chacun et écrit les jetons dans **`tokens.json`** (non committé).

---

## 3. Lancer les tests

### a) Charge REST (lectures annuaire / messages) — monte en puissance
```bash
k6 run -e STAGING_URL=$STAGING_URL -e STAGING_ANON_KEY=$STAGING_ANON_KEY rest-load.js
```
**Critères de réussite** (définis dans le script) :
- `http_req_failed` < 1 %
- `http_req_duration` p95 < 300 ms

### b) Connexions temps réel (le vrai plafond) — N connexions simultanées tenues
```bash
k6 run -e STAGING_URL=$STAGING_URL -e STAGING_ANON_KEY=$STAGING_ANON_KEY -e VUS=1500 -e HOLD=120s realtime-load.js
```
**Critères de réussite** :
- `ws_connect_failed` ≈ 0 (sur le plan Free tu verras un mur vers ~200 → c'est attendu, il faut Pro + add-on compute pour 1500)
- connexions maintenues pendant toute la durée.

> 💡 Lance d'abord à `VUS=100`, puis 300, 500, 1000, 1500 pour trouver le palier réel.

---

## 4. Nettoyage (supprime les comptes de test)
```bash
node teardown-staging.mjs
```

---

## 5. Interpréter
- Si la **charge REST** reste sous les seuils → la base + index + RLS tiennent.
- Si les **connexions temps réel** plafonnent → c'est le plan Supabase : passer en **Pro**
  (+ éventuel add-on compute) et **relever la limite de connexions Realtime**, puis relancer.
- Reporter les chiffres (palier max sans erreur, p95) → on décide des optimisations
  restantes (pagination, photos→Storage, virtualisation) **en fonction des mesures**.
