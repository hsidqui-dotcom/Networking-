# Ticket Genious — Ajout DMARC (à copier-coller)

À envoyer au support Genious Communications (ils gèrent la zone DNS).
Dès confirmation de publication, vérifier sur https://mxtoolbox.com/dmarc.aspx

---

```
Objet : Ajout d'un enregistrement DNS DMARC — domaine oneafricaforums.com

Bonjour,

Merci d'ajouter l'enregistrement DNS suivant à la zone du domaine oneafricaforums.com :

- Type : TXT
- Nom / Hôte : _dmarc.oneafricaforums.com
- TTL : 3600
- Valeur : v=DMARC1; p=none; rua=mailto:hsidqui@oneafricaforums.com; fo=1; adkim=r; aspf=r

Cet enregistrement complète notre configuration e-mail existante (SPF et DKIM de send.oneafricaforums.com déjà en place). Il est en mode surveillance (p=none) et ne bloque aucun envoi : il sert uniquement à renforcer notre réputation d'expéditeur et à recevoir des rapports.

Les rapports DMARC doivent être envoyés à l'adresse hsidqui@oneafricaforums.com (déjà existante), aucune création d'alias n'est nécessaire.

Pourriez-vous me confirmer une fois l'enregistrement publié ?

Bien cordialement,
Hind Sidqui
One Africa Forums
```

---

## Évolution prévue (après l'événement)

Une fois quelques semaines de rapports DMARC propres :
1. Passer `p=none` → `p=quarantine` (les mails usurpés vont en spam).
2. Puis `p=quarantine` → `p=reject` (protection maximale).

Re-ouvrir un ticket Genious en remplaçant uniquement la valeur `p=`.
