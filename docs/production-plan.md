# OAF Connect — Plan de mise en production
### De la maquette à l'app multi-utilisateurs, téléchargeable, pour le prochain forum OneAfricaForums

*Document de cadrage · 2026 · estimations (les coûts varient selon l'équipe, le pays et le volume).*

---

## 0. Objectif
Une application **réelle, multi-utilisateurs**, **téléchargeable** (web + Android + iOS,
App Store & Google Play), **fonctionnelle pour le prochain événement**, que chaque
participant peut installer, où il se connecte avec son compte, retrouve le programme,
les autres participants, le matchmaking, les RDV, le chat et les notifications — et que
**l'équipe OneAfricaForums pilote** depuis l'espace admin.

Le prototype actuel (PWA + admin) prouve l'expérience. Pour la production, il manque
**4 briques** : (1) des **comptes utilisateurs**, (2) une **base de données partagée en
ligne** (au lieu du stockage local), (3) le **temps réel + notifications push**,
(4) la **publication sur les stores**.

---

## 1. Architecture cible

```
   📱 App participant (PWA + coque native Capacitor)   🖥️ Espace admin (web)
                     │                                        │
                     └──────────────┬─────────────────────────┘
                                    ▼
                        🔌 Backend / API + Temps réel
                     (Supabase : Auth + Postgres + Realtime + Storage)
                                    │
        ┌───────────────┬──────────┼───────────────┬──────────────┐
        ▼               ▼          ▼                ▼              ▼
   Notifications     E-mail     SMS / WhatsApp   Paiement      Stockage
   push (FCM)     (Resend)   (Africa's Talking) (Stripe…)   images (cloud)
```

### Choix technologiques recommandés (pour réduire coût + délai)
| Brique | Recommandation | Pourquoi |
|---|---|---|
| **App** | On garde la base PWA actuelle, emballée avec **Capacitor** | Un seul code → web + iOS + Android ; on capitalise sur l'existant |
| **Backend** | **Supabase** (Auth + Postgres + Realtime + Storage + sécurité par ligne) | Évite de développer un backend de zéro → **gros gain de temps et de coût** ; passe à l'échelle |
| **Comptes** | Email + code OTP + connexion Google/LinkedIn | Simple, sûr, adapté à un public pro panafricain |
| **Push** | **Firebase Cloud Messaging** (ou OneSignal) | Gratuit, standard iOS/Android |
| **E-mail** | Resend ou Postmark | Confirmations, rappels |
| **SMS / WhatsApp** | **Africa's Talking** (panafricain) ou Twilio | Repli faible-connexion |
| **Hébergement front** | Cloudflare Pages / Vercel | Gratuit, CDN mondial |
| **Paiement / billetterie** | Stripe + un acteur mobile-money (selon pays) | Préventes, billets |

> Alternative « tout Google » : **Firebase** à la place de Supabase. Coût et délai comparables.

---

## 2. Les étapes, une par une (avec livrables)

### Phase A — Cadrage & design final · ~1–2 sem
- Spécifications détaillées + modèle de données validés.
- Charte finalisée (logo, couleurs déjà prêts), maquettes des derniers écrans.
- Choix des fournisseurs (Supabase, push, e-mail, SMS).
- **Livrable :** cahier des charges + plan de données + comptes fournisseurs ouverts.

### Phase B — Backend & comptes · ~2–3 sem
- Mise en place Supabase : base Postgres (événements, participants, sessions, sponsors,
  messages, RDV, notifications), **authentification** (email/OTP/social), **stockage images**,
  **règles de sécurité** (chaque participant ne voit que ce qu'il a le droit de voir).
- API + droits (participant / intervenant / sponsor / organisateur).
- **Livrable :** backend en ligne, sécurisé, testé.

### Phase C — App participant connectée · ~3–4 sem
- On remplace le stockage local par le backend : **inscription/connexion**, profil
  (photo, « je recherche… »), programme + agenda perso, annuaire, **matchmaking IA**,
  **chat temps réel**, **prise de RDV**, **notifications push**, mode hors-ligne, FR/EN.
- **Livrable :** app participant réelle, multi-utilisateurs.

### Phase D — Espace admin connecté · ~2–3 sem
- CRUD serveur (programme, intervenants, sponsors), **import CSV** des participants,
  **diffusion de notifications push**, **tableau de bord live** (inscrits, engagement,
  RDV, ROI sponsors), gestion des logos/bannières.
- **Livrable :** back-office opérationnel pour l'équipe.

### Phase E — Matchmaking, sécurité & RGPD · ~1–2 sem
- Algorithme de correspondances (intentions + intérêts ; option IA par « embeddings »).
- Consentement, visibilité opt-in, export/suppression de données, politique de
  confidentialité, conditions d'utilisation.
- **Livrable :** conformité + matchmaking de qualité.

### Phase F — Apps natives & publication stores · ~1–2 sem
- Emballage **Capacitor** → builds **iOS** et **Android**.
- Icônes/splash, fiches store (descriptions, captures), comptes développeur.
- **Soumission** App Store (revue Apple ~1–3 jours) + Google Play (~1–3 jours).
- **Livrable :** app **téléchargeable** sur les deux stores + en PWA web.

### Phase G — Tests & montée en charge · ~1–2 sem
- Recette fonctionnelle, tests sur vrais téléphones, **test de charge** (pic des 3 jours),
  monitoring (erreurs, performance), correctifs.
- **Livrable :** app stable validée pour le volume attendu.

### Phase H — Préparation de l'événement · ~1 sem (J-14 → J-1)
- Chargement du **contenu réel** (programme, intervenants, sponsors, participants).
- Génération des **badges/QR**, **formation de l'équipe** admin, campagne d'invitation
  (e-mail/SMS « Téléchargez l'app »).
- **Livrable :** événement prêt dans l'app, participants invités.

### Phase I — Jour J & après
- **Support en direct** (notifications, assistance), suivi de l'engagement en temps réel.
- **Post-événement :** rediffusions, enquêtes, rapport ROI sponsors, bascule en
  **communauté 365** jusqu'au prochain forum.

**⏱️ Durée totale réaliste : ~10 à 14 semaines** (≈ 2,5–3,5 mois) pour une V1 soignée.
Une **version MVP** plus resserrée est possible en **~8 semaines**.

---

## 3. Multi-plateforme & téléchargement
| Cible | Moyen | Délai |
|---|---|---|
| **Web** (tout navigateur) | URL de la PWA | Immédiat |
| **Android / iPhone (installable)** | « Ajouter à l'écran d'accueil » (PWA) | Immédiat |
| **Google Play** | PWA emballée (Capacitor) | Revue ~1–3 j |
| **Apple App Store** | PWA emballée (Capacitor) | Revue ~1–3 j |

**À fournir par OneAfricaForums :** un **compte Apple Developer** (au nom de
l'organisation, idéalement « Organization » avec un numéro D-U-N-S — gratuit),
un **compte Google Play**, le **logo officiel**, et les **données du prochain événement**.

---

## 4. Équipe nécessaire (V1)
- **1 développeur full-stack** (backend + app) — rôle central.
- **0,5 développeur front / intégrateur** (finitions UI, stores).
- **0,3 designer** (ponctuel : icônes, captures store, derniers écrans).
- **0,2 chef de projet / QA** (recette, coordination).
- **Côté OneAfricaForums :** 1 référent contenu + 1 référent admin pour l'événement.

> Possible avec **1 à 2 personnes** seniors sur ~3 mois, ou une **petite équipe** en parallèle pour aller plus vite.

---

## 5. 💰 Coûts réels (estimations)

### 5.1 Coûts FIXES obligatoires
| Poste | Coût | Fréquence |
|---|---|---|
| Apple Developer Program | **99 $** | par an |
| Google Play Console | **25 $** | une seule fois |
| Nom de domaine (ex. app.oneafricaforums.com) | **~15 $** | par an |
| Certificat SSL (Let's Encrypt) | **0 $** | — |

### 5.2 Coûts RÉCURRENTS (infrastructure & services)
| Poste | Hors événement | Mois de l'événement |
|---|---|---|
| Backend + base de données (Supabase Pro) | **~25 $/mois** | ~25–100 $ |
| Hébergement front + CDN (Cloudflare/Vercel) | **0–20 $/mois** | 0–20 $ |
| Stockage images | inclus / **~5–15 $/mois** | ~10–25 $ |
| Notifications push (FCM) | **0 $** | 0 $ |
| E-mail (Resend/Postmark) | **0–20 $/mois** | ~20–40 $ |
| Monitoring/erreurs (Sentry, free) | **0 $** | 0 $ |
| **Sous-total infra** | **~50–100 $/mois** | **~100–250 $** |

### 5.3 Coûts À L'USAGE (par événement, ~2 500 participants)
| Poste | Estimation par événement |
|---|---|
| SMS / WhatsApp (invitations + rappels, selon pays) | **~50–400 $** |
| Pic d'infrastructure pendant les 3 jours | **~50–200 $** |
| Matchmaking IA (si « embeddings » ; sinon 0) | **~0–60 $** |
| **Sous-total par événement** | **~100–650 $** |

### 5.4 Coût de DÉVELOPPEMENT (one-time, le poste principal)
Très variable selon l'équipe et le pays. On s'appuie sur le prototype existant.

| Scénario | Description | Fourchette |
|---|---|---|
| **Économique** | Freelances/petit studio (souvent Afrique ou remote), approche BaaS, on capitalise sur le prototype | **~12 000 – 25 000 $** |
| **Standard** | Studio/agence structurée, V1 complète + recette + stores | **~30 000 – 60 000 $** |
| **Premium** | Agence senior, natif poussé, SLA, sécurité renforcée | **~80 000 – 150 000 $+** |

> Repère d'effort : ~14–22 semaines-personne pour la V1. Le **scénario économique** est
> réaliste parce que la conception, la marque et l'expérience sont **déjà faites** (ce repo).

### 5.5 MAINTENANCE après lancement
- Infra : voir 5.2 (~50–100 $/mois).
- Renouvellement Apple : 99 $/an.
- Évolutions/support : prévoir un **forfait dev** (ex. 5–15 j/an) ou une régie selon vos besoins.

### 5.6 Exemple de budget « première année » (scénario économique)
| Poste | Montant |
|---|---|
| Développement V1 (one-time) | ~12 000 – 25 000 $ |
| Infra (12 mois) | ~700 – 1 200 $ |
| Apple + domaine | ~115 $ |
| Google Play | 25 $ |
| 2 événements (usage) | ~300 – 1 300 $ |
| **Total année 1** | **~13 200 – 27 700 $** |
| **Années suivantes** (hors évolutions) | **~1 200 – 3 000 $/an** |

*Montants indicatifs en USD, hors taxes ; un devis ferme dépend de l'équipe retenue et du périmètre final.*

---

## 6. Sécurité & conformité (inclus dans le plan)
- Authentification sécurisée, droits par rôle, **sécurité au niveau des données**.
- **Consentement & visibilité opt-in**, export/suppression des données (RGPD / lois locales).
- Politique de confidentialité + CGU, hébergement des données documenté.
- Sauvegardes automatiques, monitoring, plan de restauration.

---

## 7. Risques & parades
| Risque | Parade |
|---|---|
| Revue App Store refusée | Respect des règles Apple, build de test (TestFlight), marge de 1–2 semaines |
| Connexion faible sur site | Mode hors-ligne (PWA) + repli SMS/WhatsApp |
| Pic de charge pendant l'événement | Test de charge en amont + infra qui scale |
| Adoption des participants | Campagne d'invitation + QR sur les badges + onboarding simple |
| Données participants | Import propre, opt-in, conformité |

---

## 8. Prochaine action concrète
1. **Valider le scénario budgétaire** (économique / standard / premium) et la **date du prochain événement** (pour caler le rétroplanning).
2. **Ouvrir les comptes** : Apple Developer (org OneAfricaForums), Google Play, Supabase.
3. **Lancer la Phase A** (cadrage + données) — je peux la démarrer immédiatement à partir de ce repo.

> Recommandation : viser **J-12 semaines minimum** avant le forum pour une V1 confortable
> (J-8 pour un MVP), en gardant **2 semaines de marge** pour la revue des stores.
