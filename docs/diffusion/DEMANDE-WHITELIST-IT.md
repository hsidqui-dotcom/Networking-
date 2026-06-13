# Demande à transmettre au service informatique

**Objet : Autoriser les e-mails de l'application événementielle OAF Connect**

---

Bonjour,

Nous utilisons une application web (**OAF Connect**) pour nos événements APIDE 2026.
Elle envoie des e-mails d'invitation nominatifs à nos participants, y compris à
des collègues internes `@oneafricaforums.com`.

Ces messages sont **légitimes** mais peuvent être placés en **quarantaine** par
Microsoft 365, car ils sont envoyés au nom de notre domaine via un prestataire
d'envoi (Resend). Merci de poser les règles suivantes :

### Domaine et adresse d'envoi à autoriser
- **Domaine expéditeur :** `send.oneafricaforums.com`
- **Adresse expéditeur :** `no-reply@send.oneafricaforums.com`
- **Prestataire d'envoi (IP/infrastructure) :** Resend (`resend.com`)

### Actions demandées (Microsoft 365 / Exchange Online)
1. **Liste d'autorisation (allow-list)** de l'expéditeur `no-reply@send.oneafricaforums.com`
   et du domaine `send.oneafricaforums.com` dans la politique anti-spam
   (Defender → Politiques anti-courrier indésirable → Expéditeurs/domaines autorisés).
2. **Exclure** ce domaine de la règle de détection « spoofing intra-domaine »
   (self-domain spoofing), qui est la cause de la mise en quarantaine.
3. Optionnel : créer une **règle de flux de messagerie** (Mail Flow Rule) qui
   marque comme fiable tout message dont l'en-tête `From` se termine par
   `@send.oneafricaforums.com`.

### Vérification DNS (déjà en place de notre côté)
- Le domaine `send.oneafricaforums.com` est **vérifié** avec **SPF** et **DKIM**
  valides chez le prestataire.
- (À confirmer) Enregistrement **DMARC** sur `oneafricaforums.com`.

Cette autorisation est à poser **une seule fois** et couvrira tous nos
événements futurs.

Merci d'avance,
L'équipe One Africa Forums
