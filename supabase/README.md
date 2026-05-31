# Activer le mode réel (multi-utilisateurs) — Supabase

L'app fonctionne en **mode démo** sans rien configurer (données locales à l'appareil).
Pour passer en **mode réel** (comptes + base de données partagée), suivez ces étapes
**une seule fois** (~10 minutes, gratuit pour démarrer).

## 1. Créer le projet
1. Aller sur **https://supabase.com** → *Start your project* (compte gratuit).
2. *New project* → nom « oaf-connect », choisissez une région proche (ex. Europe/Frankfurt),
   définissez un mot de passe de base de données (gardez-le).

## 2. Créer les tables
1. Dans le projet → menu **SQL Editor** → *New query*.
2. Copiez-collez **tout** le contenu de [`schema.sql`](schema.sql) → **Run**.
   (Crée les tables, la sécurité et un événement d'exemple.)

## 3. Récupérer les 2 clés
1. Menu **Project Settings → API**.
2. Copiez **Project URL** et la clé **anon public**.

## 4. Brancher l'app
Ouvrez `app/config.js` et renseignez :
```js
window.OAF_CONFIG = {
  SUPABASE_URL: 'https://VOTRE-ID.supabase.co',
  SUPABASE_ANON_KEY: 'VOTRE_CLE_ANON'
};
```
Rechargez l'app → un **écran de connexion** apparaît (code par e-mail).
> En mode démo (clés vides), aucun écran de connexion : l'app marche comme avant.

## 5. Activer les e-mails de connexion
Dans Supabase → **Authentication → Providers → Email** : laissez « Email OTP » activé.
(Pour des e-mails à votre nom de domaine, configurez un fournisseur SMTP — optionnel.)

## 6. Se nommer administrateur
1. Connectez-vous **une fois** dans l'app avec votre e-mail.
2. SQL Editor → exécutez :
```sql
update profiles set is_admin = true
where id = (select id from auth.users where email = 'VOTRE_EMAIL');
```
Vous avez maintenant les droits organisateur (gestion programme, notifications, etc.).

## Sécurité
- Les **clés `anon`** sont conçues pour être publiques côté app ; la sécurité réelle est
  assurée par les **règles RLS** du schéma (chaque utilisateur ne voit que ce qu'il a le droit de voir).
- Ne partagez **jamais** la clé *service_role* (réservée au serveur).

## Où en est l'intégration
- ✅ Base de données + sécurité (ce schéma) · ✅ Connexion par e-mail dans l'app.
- 🔜 Itérations suivantes : lecture/écriture des écrans (programme, annuaire, chat temps réel,
  RDV, notifications push) connectées à cette base, puis emballage stores (Capacitor).
