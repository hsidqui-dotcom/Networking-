# Checklist — Pilote réel OAF Connect (~100 participants / édition)

Objectif : faire tourner l'app sur les 2 prochains événements de taille réduite,
sans mauvaise surprise. Cochez dans l'ordre.

---

## A. AVANT le pilote (1 à 2 semaines avant)

### 1. E-mails fiables — PRÉREQUIS N°1 ⚠️
Sans ça, les codes de connexion n'arrivent pas (limite + spam Supabase par défaut).
- [ ] Créer un compte **Resend** (ou Brevo/Postmark) et vérifier votre **domaine** (`oneafricaforums.com`).
- [ ] Supabase → **Project Settings → Authentication → SMTP Settings** → activer **Custom SMTP** avec les infos Resend.
- [ ] Régler l'expéditeur sur une adresse à votre domaine (ex. `connect@oneafricaforums.com`).
- [ ] Test : se connecter avec une adresse perso → le code arrive en < 1 min, **pas** dans les spams.

### 2. Base de données à jour
- [ ] Exécuter `supabase/schema.sql` (si pas déjà fait) dans **SQL Editor**.
- [ ] Exécuter les migrations : `add-event-info.sql`, `add-event-timing.sql`, `oauth-profile.sql`.
- [ ] Vérifier que la sécurité (RLS) est active sur les tables.

### 3. Compte(s) organisateur
- [ ] Se connecter une fois à l'app avec votre email pro (crée le profil).
- [ ] Exécuter `supabase/make-admin.sql` (avec votre adresse) → accès à `admin.html`.

### 4. Connexion Google / LinkedIn (optionnel mais recommandé — photos auto)
- [ ] **Google** : créer un identifiant OAuth (Google Cloud Console) → coller Client ID/Secret dans
      Supabase → Authentication → Providers → Google. URL de redirection fournie par Supabase.
- [ ] **LinkedIn** : créer une app LinkedIn (produit "Sign In with OpenID Connect") → coller dans
      Supabase → Providers → LinkedIn (OIDC).
- [ ] Test : « Continuer avec Google » → connexion + photo de profil récupérée automatiquement.

### 5. Contenu de l'événement
- [ ] Créer l'événement, dates (mode **Automatique** ou statut manuel), thème, ville.
- [ ] Importer le **programme** (CSV) et les **intervenants**.
- [ ] Remplir les **Infos pratiques** (lieu, wifi, contacts).
- [ ] Préparer la liste des **emails participants** (pour les invitations).

### 6. Répétition générale
- [ ] Test interne à **5–10 personnes** (équipe) : connexion, profil, annuaire, RDV, chat, notif.
- [ ] Vérifier sur **iPhone ET Android**, et en **ajout à l'écran d'accueil** (PWA).

---

## B. PENDANT l'événement

- [ ] Envoyer les **invitations** (email) la veille + le matin.
- [ ] Avoir une personne « support » pour aider les retardataires à se connecter.
- [ ] Utiliser les **notifications** (espace organisateur) pour les annonces clés.
- [ ] Surveiller le **tableau de bord** (participants connectés, activité).

## C. APRÈS l'événement

- [ ] Passer l'événement en statut **Passé** (ou laisser l'auto le faire).
- [ ] Récupérer les retours participants (2–3 questions).
- [ ] Noter les bugs / frictions pour la prochaine édition.

---

## Niveaux de priorité

| Indispensable au pilote | Confort (peut attendre) |
|---|---|
| E-mails fiables (SMTP) | Invitations email automatiques |
| Base + RLS à jour | Connexion Google/LinkedIn |
| Compte organisateur | Notifications push mobile |
| Contenu (programme, infos) | Rappels par email |
| Répétition à 5–10 pers. | |
