# ✅ Checklist de tests fonctionnels — OAF Connect

À refaire avant chaque grand événement. Cocher sur 2 appareils (1 iPhone/Safari + 1 Android/Chrome) et en navigation privée.

## 1. Authentification
- [ ] Connexion par **code e-mail (OTP)** : le code arrive en < 1 min, hors spam.
- [ ] Connexion **Google** : retour à l'app connecté (nom + photo récupérés).
- [ ] Connexion **LinkedIn** : idem.
- [ ] **Inscription sur invitation (H2)** : un e-mail **non importé/non invité** est **refusé** avec le message « pas sur la liste des invités ».
- [ ] Un e-mail **importé** (présent dans `guests`) peut créer son compte et atterrit **dans le bon forum**.
- [ ] **Déconnexion** : retour à l'écran de login, pas d'état résiduel.

## 2. Profil
- [ ] Modifier nom, fonction, pays, intérêts, « je recherche » → sauvegarde OK.
- [ ] Ajouter une **photo** → s'affiche dans l'annuaire.
- [ ] Basculer **visible / invisible** → l'effet est correct côté annuaire.

## 3. Annuaire cloisonné (H1)
- [ ] Je vois les participants **de mon forum**.
- [ ] Un participant **d'un autre forum** n'apparaît **PAS**.
- [ ] Le **score de correspondance** s'affiche et le tri est cohérent.
- [ ] Recherche par nom/fonction → filtre correct.

## 4. Messagerie + anti-abus (H3)
- [ ] Envoyer / recevoir un message **en temps réel** (2 appareils).
- [ ] **Bloquer** un contact → on ne reçoit plus ses messages.
- [ ] **Signaler** → visible dans Console → Participants → Modération.
- [ ] **Anti-spam** : envoyer très vite > 30 messages/min → message « trop de messages ».

## 5. Connexions & RDV
- [ ] Envoyer une demande de connexion → l'autre la reçoit.
- [ ] Proposer un **RDV** sur un créneau → pas de double création en double-tap.

## 6. Programme & Q&A
- [ ] Programme s'affiche, onglets jours OK, « Mon agenda » (favoris) OK.
- [ ] Ouvrir une session → **poser une question** + **voter** → mise à jour temps réel.

## 7. Notifications (temps réel incrémental)
- [ ] Depuis la **console**, diffuser une notification.
- [ ] Sur l'app connectée : la notif **apparaît instantanément SANS rechargement/clignotement** de toute la page. ← (vérifie le correctif de fiabilité)

## 8. Console organisateur
- [ ] Import **CSV programme** + **CSV participants (avec e-mails)**.
- [ ] **Invitations e-mail** envoyées.
- [ ] **QR code** s'affiche (charge `qrcode` depuis esm.sh — vérifie que la CSP ne bloque pas).

## 9. PWA / réseau
- [ ] Installer sur l'écran d'accueil (iOS + Android).
- [ ] Passer en **mode avion** → l'app reste affichée (données en cache), pas d'écran blanc.
- [ ] Revenir en ligne → la connexion temps réel reprend.

## 10. Sécurité (rapide)
- [ ] Un participant **ne peut pas** se promouvoir admin (déjà bloqué côté base).
- [ ] Les **e-mails** des autres ne sont jamais visibles dans l'app.
- [ ] Console : la CSP n'empêche ni la connexion Supabase ni le QR.
