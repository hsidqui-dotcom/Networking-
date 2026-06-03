# Guide de lancement — stratégie web-first (max d'adoption)

Objectif : l'expérience la plus intuitive, le plus de participants actifs,
au coût le plus bas. Pas d'app store, zéro installation : un lien suffit.

## Pourquoi cette stratégie
- **Zéro friction** : pas de téléchargement App Store/Play Store (la cause n°1
  d'abandon). Idéal pour un public panafricain (Android majoritaire, data variable).
- **Coût ~0** et mises à jour instantanées (pas de validation de store).
- **Profils pré-remplis** : comme Whova, « l'app vous connaît déjà ».

## Les 4 leviers (dans l'ordre)

### 1. Pré-charger la liste des participants  ⭐ levier n°1
Admin → **Participants → Importer un CSV**. Format :
`name, role, country, interests, email`
- L'**e-mail** est la clé : à sa première connexion, le participant **retrouve sa
  fiche déjà remplie** (fonction, pays, intérêts) et le doublon disparaît.
- Votre fichier `docs/participants_apf2026.csv` marche tel quel ; ajoutez juste
  une colonne `email` pour activer le profil pré-rempli.
- Pré-requis base : exécuter `supabase/preload-claim.sql` une fois.

### 2. Connexion par lien magique (1 clic, pas de code à taper)
Supabase → **Authentication → Email Templates → Magic Link** : laissez le bouton
qui pointe vers `{{ .ConfirmationURL }}`. L'app gère déjà le retour automatique
(le participant clique → il est connecté, sans saisir de code).
> Le code à 6 chiffres reste disponible en secours.

### 3. Invitation e-mail
Admin → **Participants → ✉️ Inviter par e-mail** (voir `supabase/invitations.sql`).
Envoie à chacun le lien de l'app. À coupler avec la liste pré-chargée (levier 1).

### 4. QR code sur place  ⭐ canal n°1 en présentiel
Admin → **Réglages → 📱 QR code d'accès** → *Générer*. Imprimez-le / affichez-le
sur les badges, kakémonos, écrans. On scanne → l'app s'ouvre instantanément.

## Bonus expérience
- **Photo auto** via Google/LinkedIn (déjà actif une fois les providers configurés).
- **Ajout à l'écran d'accueil** : un message guide l'utilisateur (iOS : Partager →
  « Sur l'écran d'accueil » ; Android : « Installer l'application »).

## Et l'app native (App Store) ?
À garder pour la **phase 2**, seulement si le pilote révèle un besoin réel
(notifications push poussées, présence en store). Le moment venu, le **même code**
pourra être publié dans les stores via **Capacitor** — sans réécriture.

## Ordre de mise en route
1. `schema.sql` à jour, puis `preload-claim.sql` + `invitations.sql` + `oauth-profile.sql`.
2. `make-admin.sql` (vos droits organisateur).
3. Importer la liste participants (avec e-mails).
4. Régler le modèle d'e-mail sur lien magique + brancher Resend (déjà fait).
5. Tester : s'inviter soi-même → cliquer le lien → profil pré-rempli ✓.
6. Générer le QR code pour le jour J.
