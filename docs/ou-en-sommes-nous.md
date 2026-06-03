# Où en est le projet — point d'étape

_Dernière mise à jour : 2026-06-03_

## ✅ Fait (et validé en direct)

- **Base de données Supabase** opérationnelle (projet `qxxjsqctkltnjptqdbye`),
  tables créées, **9 profils** existants.
- **App reliée à Supabase** (`app/config.js` rempli : URL + clé anon). Mode réel actif.
- **Colonne `email`** ajoutée aux participants pré-chargés (`guests.email`).
- **Profil qui se remplit tout seul** activé : fonction `handle_new_user` +
  déclencheur installés (effet « l'app me connaît déjà »). Quand un invité de la
  liste se connecte, son profil hérite de fonction/pays/intérêts et le doublon
  disparaît. _(fichier de réf : `supabase/preload-claim.sql`)_
- **Droits organisateur** accordés au compte `hsidqui…` :
  `select count(*) from public.profiles where is_admin = true;` → **2** ✅

## ⏸️ On a mis en pause ici
Prêt à **importer la liste des participants**, mais on reprend demain.

## ▶️ À faire à la prochaine session (dans l'ordre souhaité)

### 1. Connexion Google + LinkedIn (priorité demandée)
But : se connecter en **1 tap**, avec **photo de profil automatique**.
- Activer les fournisseurs dans **Supabase → Authentication → Providers**
  (Google, puis LinkedIn / « LinkedIn OIDC »).
- Créer les identifiants OAuth côté Google Cloud et LinkedIn Developers
  (je guiderai clic par clic).
- Renseigner les URL de redirection fournies par Supabase.
- Le fichier `supabase/oauth-profile.sql` complète la récupération de la photo.

### 2. Importer la liste des participants
- Console organisateur : **adresse de l'app + `/admin.html`**
  (app hébergée sur **oneafricaforums.com**).
- Connexion : e-mail `hsidqui@oneafricaforums.com` → code à 6 chiffres → la
  console s'ouvre (compte déjà admin).
- Onglet **👥 Participants → 📥 Importer un CSV**.
- Fichier de base : `docs/participants_apf2026.csv` (~100 personnes).
  Colonnes : `name, role, country, interests` **+ `email` (optionnel)**.
  Ajouter la colonne `email` = active le « profil déjà rempli » à la connexion.

### 3. Pour le jour J
- Générer le **QR code d'accès** : console → **⚙️ Réglages → 📱 QR code**.
- (Optionnel) Lien magique : Supabase → Authentication → Email Templates.

## 🧯 Pièges iPad rencontrés (pour mémoire, si on repasse par le SQL Editor)
- L'iPad transforme `new.id` / `g.id` en `<new.id>` car **`.id` ressemble à une
  adresse web** → solution : **espaces autour du point** (`new . id`).
- L'iPad change les **guillemets** `'…'` en guillemets courbes → la base ne
  comprend plus → solution : emballer les textes avec **`$$ … $$`** (deux dollars).
- Copier le **fichier d'origine** (jamais le code depuis le chat) évite ces
  transformations. Astuce générale : désactiver _Réglages → Général → Clavier →
  Ponctuation intelligente_.
