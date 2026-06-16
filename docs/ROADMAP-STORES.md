# 🏪 FEUILLE DE ROUTE — Mise sur les stores (App Store + Google Play)
*OAF Connect — One Africa Forums. Document de cadrage. Créé le 16 juin 2026.*

> But : amener OAF Connect sur l'**App Store** et **Google Play** pour l'image de
> marque. **Projet post-événement** (3 à 6 semaines) — non requis pour APIDE 2026
> (la PWA s'installe déjà via « Sur l'écran d'accueil »).

---

## ⚠️ À savoir d'abord (réalité Apple)
- Il n'existe **aucun « test » qui certifie** l'éligibilité aux stores. La seule porte = la **revue** Apple/Google de l'app **soumise**.
- L'app est une **PWA** : pour aller sur les stores, on l'**emballe** dans une app native (pas de soumission directe d'un site web).
- **Apple rejette souvent les simples emballages web** (règle **4.2 — Minimum Functionality**). Pour passer, il faut une **vraie valeur native** → le plus naturel = les **notifications push natives**. Le store et le push vont donc **ensemble**.

---

## PHASE 0 — Prérequis à lancer MAINTENANT (le « long pole »)

| Élément | Détail | Coût | Délai |
|---|---|---|---|
| **Apple Developer Program — Organisation** | Au **nom de l'entreprise** (pas perso, pour l'image de marque). Nécessite un **numéro D-U-N-S**. | **99 $/an** | enrôlement quelques jours |
| **Numéro D-U-N-S** | Identifiant entreprise (Dun & Bradstreet). À demander via le lien Apple. | **Gratuit** | **1 à 14 jours** ⚠️ |
| **Google Play Console — Organisation** | Compte développeur entreprise + vérification d'identité (D-U-N-S aussi requis désormais). | **25 $ (unique)** | 1-3 jours |
| **Politique de confidentialité (URL)** | Page hébergée obligatoire pour les deux stores. | gratuit | à rédiger |

### Action immédiate
1. Aller sur **developer.apple.com/enroll** → choisir **« Company / Organization »**.
2. Apple demande le **D-U-N-S** : s'il n'existe pas, demander le numéro (gratuit) via le **lien fourni par Apple** (vérification du nom légal de l'entreprise).
3. En parallèle, ouvrir **play.google.com/console** → créer un compte **Organisation**.

> 💡 Le D-U-N-S est ce qui prend le plus de temps → **on le lance en premier**, le reste attend l'après-événement.

---

## PHASE 1 — Technique (après l'événement)

1. **Ajouter la valeur native (anti-rejet 4.2)** : implémenter les **notifications push** (Web Push / natif) + vérifier le fonctionnement hors-ligne. *(= « Option B » du backlog notifications.)*
2. **Finaliser le manifest PWA** : ajouter une **icône `maskable`** (logo centré dans la zone de sécurité) pour un rendu propre sur Android. *(Manifest actuel déjà valide : nom, icônes 192/512, `display: standalone`, couleurs.)*
3. **Empaqueter avec PWABuilder** (gratuit, https://www.pwabuilder.com) :
   - **Google Play** → génère un package **TWA** (Trusted Web Activity) → simple, Play accepte les PWA.
   - **iOS** → génère un **projet Xcode** → nécessite un **Mac + Xcode** (ou un service de build cloud).

---

## PHASE 2 — Soumission

1. **Google Play d'abord** (plus simple, plus rapide) : uploader le package, remplir la fiche (captures, description, classification), soumettre → revue (heures à quelques jours).
2. **App Store** : construire sur **Mac/Xcode**, remplir **App Store Connect** (icône 1024px, captures multi-appareils, **étiquettes de confidentialité**, classification d'âge), soumettre → revue (~1-3 jours).
   - **Prévoir un éventuel rejet 4.2** → répondre en mettant en avant la **valeur native** (push, temps réel, networking).

---

## 💰 Récapitulatif coûts
- Apple Developer : **99 $/an**
- Google Play : **25 $ (unique)**
- D-U-N-S : **gratuit**
- (Optionnel) service de build Mac cloud si pas de Mac : variable
- PWABuilder : **gratuit**

## 👥 Qui fait quoi
- **Comptes & D-U-N-S** : Hind (au **nom de l'entreprise** — cohérent avec la consigne « tout au nom de l'entreprise »).
- **Build & soumission** : une personne technique (ex. Amine) avec un **Mac**, ou build cloud.
- **Assets** (icône 1024, captures, politique de confidentialité) : équipe OAF.

## ⏱️ Délai réaliste
**3 à 6 semaines** (attente D-U-N-S + build + allers-retours de revue). À démarrer **après APIDE 2026**, sauf le **compte Apple + D-U-N-S** qu'on lance **dès maintenant**.

## ⚠️ Risques & parades
| Risque | Parade |
|---|---|
| Rejet Apple 4.2 (emballage web trop simple) | Ajouter le **push natif** + valeur networking réelle avant soumission |
| Délai D-U-N-S | **Lancer la demande maintenant** |
| Pas de Mac pour le build iOS | Service de build cloud (PWABuilder/CI) |
| Propriété des comptes | Tout créer **au nom de l'entreprise** + 2 admins |
