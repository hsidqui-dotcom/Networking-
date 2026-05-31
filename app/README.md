# OAF Connect — Prototype fonctionnel (PWA + Admin)

Itération 1 du **vrai prototype** (au-delà de la maquette) : une **PWA installable**
(fonctionne hors-ligne) avec un **espace organisateur (admin)** relié à une base
de données locale partagée. Bilingue **FR / EN**.

## Contenu
| Fichier | Rôle |
|---|---|
| `index.html` + `app.js` | App **participant** (PWA installable, hors-ligne) |
| `admin.html` + `admin.js` | **Espace organisateur** : tableau de bord, programme (CRUD), notifications, participants, réglages |
| `store.js` | « Base de données » partagée (localStorage) — l'admin écrit, l'app lit |
| `style.css` | Charte OneAfrica (jaune & noir) |
| `manifest.webmanifest` + `sw.js` + `icon.svg` | Installabilité + cache hors-ligne |

## Démo de la boucle organisateur → participant
1. Ouvrir **`admin.html`** → code d'accès **`admin`**.
2. Onglet **Programme** → ajouter une session. Onglet **Notifications** → diffuser un message.
3. Ouvrir **`index.html`** (autre onglet) → la session apparaît dans le **Programme**,
   le message dans les **Notifications**. (Les onglets ouverts se rafraîchissent automatiquement.)
4. Côté participant : ★ enregistre des sessions, « Se connecter » ajoute des contacts →
   ces chiffres remontent **en direct** dans le tableau de bord admin.

## Déploiement
- **Web / Android / iPhone** : ouvrir l'URL → « Ajouter à l'écran d'accueil » (PWA installable, hors-ligne).
- **App Store (Apple) & Google Play** : emballer cette PWA avec **Capacitor** (coque native)
  → soumission aux deux stores. (Compte Apple Developer 99 $/an ; Google Play 25 $ unique.)

## Statut
Prototype : la persistance est **locale à l'appareil** (localStorage). L'étape suivante
est un **backend** (comptes, temps réel multi-utilisateurs, notifications push, paiements).

> Données d'exemple illustratives. Code d'accès admin de démo : `admin`.
