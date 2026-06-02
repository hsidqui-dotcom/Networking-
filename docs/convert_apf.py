# -*- coding: utf-8 -*-
import csv

DATA = """Invité fo|AAZES|Monsieur|Souleymane Abdoulaye|Wardougou|Directeur Général Adjoint|Tchad
Intervenant|AfCFTA|Monsieur|Chawki|Jaballi|Head of the Customs Capacity Building and Training|Ghana
Intervenant|AfDB|Monsieur|James|Nganga|Principal Ports and Maritime Transport Officer|Côte d'Ivoire
Intervenant|AfDB|Madame|Aicha|Nono|Principal Investment Officer|Côte d'Ivoire
Intervenant|Africa50|Madame|Yousra|Khayati|Investment Director|Maroc
Inscrit|ArcelorMittal Project|Monsieur|Tella|Adewale|Technical Sales Manager|Nigeria
partenaire|Bénin Manutentions|Monsieur|Redouane|Mihramane|Directeur Général|Bénin
partenaire|Bénin Manutentions|Monsieur|Nour-Eddine|Ouakka|Directeur Commercial & Marketing|Bénin
partenaire|Bénin Manutentions|Monsieur|Gildas|Segla|Directeur Financier & Comptable|Bénin
partenaire|Bénin Manutentions|Madame|Iriss Suzel|Amoussou|Chargée de Communication & RSE|Bénin
Inscrit|Besix|Monsieur|Christophe|Debeuf|Business Development Manager - Africa|Belgique
Inscrit|CID|Monsieur|Abdelghani|Moustaid|Responsable de l'activité internationale|Maroc
Inscrit|CID|Monsieur|Lahoucine|Adjar|Chef de Division Aménagements Maritimes et Portuaires|Maroc
partenaire|CIMAF|Monsieur|Omar|El Ghaouti|Country General Manager|Ghana
partenaire|CIMAF|Monsieur|Joseph Kobina|Aboo|Deputy General Manager|Ghana
partenaire|CIMAF|Monsieur|Daniel|Akorful|Head of Logistics|Ghana
partenaire|CIMAF|Monsieur|Eric Mamy|Andriamachiharivony|Technical Director|Ghana
partenaire|CIMAF|Monsieur|Abdelaziz|Mounji|Finance Director|Ghana
partenaire|Cires Technologies|Monsieur|Houmad|El Ouazzani||Maroc
Inscrit|Dar Al Handasah Consultants|Monsieur|Awuni|Ali Dib|Ingénieur|Ghana
Inscrit|EATP SARL|Monsieur|Ibrahim Kalil|Toure|Entrepreneur|Mali
Inscrit|Eiffage Génie Civil International & Marine|Monsieur|Joffray|Loussouarn|Business Development Director|France
Inscrit|Flying Whales|Monsieur|Aristide|Zongo||France
Intervenant|Forvis Mazars|Monsieur|Safall|Fall|Associate Director - Infrastructure|Maroc
Intervenant|Ghana Free Zones Authority|Monsieur|Musah|Sibiri Hamidu|Deputy Chief Executive Officer (Finance & Administration)|Ghana
Invité fo|Ghana Free Zones Authority|Madame|Hanatu|Abubakar-Bimi Hajia|Director Administration|Ghana
Invité fo|Ghana Investment Promotion Centre|Madame|Afua Tekyi|Mills|Deputy Director - Head of Marketing and Communication|Ghana
Invité fo|Ghana Investment Promotion Centre|Madame|Sheila|Tamakloe|Senior Investment Promotion Officer - Marketing and Comms|Ghana
Invité fo|Ghana Investment Promotion Centre|Madame|Elohin Princess|Yartey|Investment Promotion Officer|Ghana
Intervenant|Ghana Ports and Harbours Authority|Monsieur|Justice|Awosonviri Akodia|Corporate Monitoring Manager & ISO Coordinator|Ghana
Intervenant|IFC|Monsieur|Ayoboni|Akindolie|Investment Officer|Ghana
Intervenant|IFC|Monsieur|Charles|Adebier|Senior Investment Officer|Ghana
Intervenant|iolabs|Monsieur|Oussama|Chougrani|Founder & Lead|Maroc
Invité fo|Kenya Port Authority|Monsieur|Edward|Kamau|General Manager Corporate Services|Kenya
Inscrit|Kenya Port Authority|Monsieur|Aza|Nassir|Personal Assistant to the Managing Director|Kenya
Inscrit|Kenya Port Authority|Monsieur|Ali|Hammo|Accountant|Kenya
Inscrit|Kenya Port Authority|Monsieur|Samuel|Kaptum|Assistant Human Resources Officer|Kenya
Inscrit|Kenya Port Authority|Madame|Irene|Kurgat|Administrative Officer - Housekeeping|Kenya
Intervenant|KPMG|Monsieur|Kwasi|Amano Awuku|Manager|Ghana
Invité fo|KPMG|Monsieur|Jeremiah|Addo|Manager|Ghana
Invité fo|KPMG|Monsieur|Daniel|Amponsah Asante||Ghana
Invité fo|KPMG|Monsieur|Michael|Narh||Ghana
Intervenant|Lafont Africa Corporation|Monsieur|Dominique|Lafont|CEO|France
Intervenant|LAPSSET|Monsieur|Stephen|Ikua|CEO|Kenya
Invité fo|LAPSSET|Madame|Nelius|Njoroge|Assistant Director Admin|Kenya
Inscrit|Liebherr Ghana Ltd|Monsieur|Anandh|Swaminathan|Head of Division - Liebherr Maritime|Ghana
Inscrit|Marine Solutions Sarl|Monsieur|Cedrique|Boko|Chef d'entreprise|Bénin
partenaire|Marsa Maroc|Monsieur|Mehdi|Menouar|Business Development / Investments Manager|Maroc
partenaire|Marsa Maroc|Madame|Fatima Zahra|Hrar|Chef du Département Communication & RSE|Maroc
partenaire|Marsa Maroc|Madame|Najwa|Aboudahab|Chef du Département Investissement|Maroc
partenaire|Marsa Maroc International Logistics|Monsieur|Reda|Moukhli|Directeur Général|Maroc
Inscrit|Medlog Ghana|Monsieur|Tichou|Quassi Mensah|General Manager|Ghana
Intervenant|Meridian Port Services Ltd|Monsieur|Charles|Osafo|Assistant Stakeholder Engagements Manager|Ghana
Intervenant|Ministry of Transport|Hon.|Joseph|Bukari Nikpe|Minister of Transport|Ghana
Partenaire|MPS|Monsieur|Frank Ebo|Brown||Ghana
Partenaire|MPS|Monsieur|Charles|Osafo||Ghana
Partenaire|MPS|Madame|Agnes|Ayesu-Amedorme||Ghana
Partenaire|MPS|Madame|Leonora|Akpey||Ghana
Partenaire|MPS|Monsieur|Yaw|Annor-Anim||Ghana
Partenaire|MPS|Madame|Davina|Agyemang||Ghana
Partenaire|MPS|Madame|Laure|Ngombi||Ghana
Partenaire|MPS|Monsieur|Olivier|Caslin||Ghana
Partenaire|MPS|Madame|Bridget|Hackman||Ghana
Partenaire|MPS|Madame|Josephine|Biney||Ghana
Intervenant|MPS - Port of Tema|Monsieur|Mohamed|Samara|General Director|Ghana
Inscrit|MSC Ghana Limited|Monsieur|Garmy|Sy|Managing Director|Ghana
Inscrit|MSC Ghana Limited|Monsieur|Dominic|Ayi|Operations Director|Ghana
Inscrit|Novus Africa|Monsieur|Khalid|Dahbi|Directeur Gérant|Maroc
Intervenant|OCDE|Dr|Arthur|Minsat|Chef d'unité Afrique Europe et Moyen-Orient - Économiste senior|France
Intervenant|PMAESA|Col|André|Ciseau|Secretary General|Kenya
Invité fo|Port Autonome de Conakry|Monsieur|Karifala|Fofana|Conseiller technique du DG|République de guinée
Invité fo|Port Autonome de Conakry|Monsieur|Sory|Magassouba|Directeur de la coopération|République de guinée
Invité fo|Port Autonome de Conakry|Monsieur|Lancei|Doumbouya|Cadre Direction Coopération|République de guinée
Intervenant|Port Autonome de Cotonou|Monsieur|Bart|Van Eenoo|Directeur Général|Bénin
partenaire|Port Autonome de Cotonou|Madame|Cica Bidossessi Gislaine|Amoussou||Bénin
Invité fo|Port Autonome de Douala|Monsieur|Olivier|Mbea|Ingénieur d'Études et de Prospectives|Cameroun
Invité fo|Port Autonome de Douala|Monsieur|Ahhmadou|Tidjani|Directeur de l'exploitation|Cameroun
Invité fo|Port Autonome de Douala|Monsieur|Olivier|Tayah|Chef Service Facturation|Cameroun
Invité fo|Port Autonome de Douala|Monsieur|Talla Yvette|Yeyo|Chef de Brigade de Recouvrement|Cameroun
Invité fo|Port Autonome de Lomé|Monsieur|Derman|Abdoul-Razak|Directeur Commercial|Togo
Intervenant|Port Autonome de Lomé|Madame|d'Almeida|Bilabina Abiré|Directrice de l'Exploitation|Togo
Invité fo|Port Autonome de Lomé|Monsieur|Kodjo|Deakissim|Contrôleur de Gestion|Togo
Intervenant|Prime Meridian Docks|Madame|Maria|Ogbugo|Project Development Coordinator|Ghana
Invité fo|Puffa Nigeria Limited|Monsieur|Joseph|Ambakederimo|CEO|Nigeria
Intervenant|Sierra Leone Ports and Harbours Authority|Monsieur|Yankuba|Askia Bio|Director General|Sierra Leone
Invité fo|Sierra Leone Ports and Harbours Authority|Monsieur|Martin|Maada George|Company Secretary|Sierra Leone
Invité fo|Sierra Leone Ports and Harbours Authority|Monsieur|Alpha|Yayah Bangura|Harbour Master|Sierra Leone
Invité fo|Sierra Leone Ports and Harbours Authority|Monsieur|Abu Bakarr|Kamara|Director - Planning & Research|Sierra Leone
Inscrit|SMMC Port Toamasina|Monsieur|Cadet|Hajatiana Endor|Directeur Général|Madagascar
Intervenant|Tanger Med|Monsieur|Amine|Malti|Directeur Études Maritimes et Portuaires & Océanographie|Maroc
Intervenant|Tanger Med Engineering|Monsieur|Nasser|Tlassellal|Directeur Général|Maroc
Intervenant|Tanger Med Engineering|Monsieur|Adil|Raissouni|Directeur Digital Planning|Maroc
Intervenant|Tanger Med Engineering|Monsieur|Oussama|Boushaba|Directeur Gestion d'Assets & Solutions Numériques|Maroc
partenaire|Tanger Med Engineering|Monsieur|Imam|Fertat|Business Développement Afrique de l'Ouest|Maroc
Partenaire|Tanger Med Engineering|Monsieur|Mohamed|Bensouda|Strategic Intelligence Manager|Maroc
partenaire|Tanger Med Port Authority|Madame|Fatima Ezzahraa|Lakhdadi||Maroc
Invité fo|The World Bank|Madame|Anita|Msami|Transport Intern|Tanzanie
Intervenant|Unido|Monsieur|Tidiane Edouard|Boye|Représentant|Côte d'Ivoire
Intervenant|World Bank|Monsieur|Ndeye|D. D. Gueye|Transport Specialist|Ghana
Intervenant|World Bank|Madame|Akua|Timpabi||Ghana
Invité fo|Yilport - ATSL (Takoradi)|Monsieur|Aaron|Ayayee|Commercial Manager|Ghana"""

flag = {
    "Tchad": "🇹🇩", "Ghana": "🇬🇭", "Côte d'Ivoire": "🇨🇮", "Maroc": "🇲🇦",
    "Nigeria": "🇳🇬", "Bénin": "🇧🇯", "Belgique": "🇧🇪", "France": "🇫🇷",
    "Kenya": "🇰🇪", "Mali": "🇲🇱", "Burkina Faso": "🇧🇫", "République de guinée": "🇬🇳",
    "Cameroun": "🇨🇲", "Togo": "🇹🇬", "Sierra Leone": "🇸🇱", "Madagascar": "🇲🇬",
    "Tanzanie": "🇹🇿",
}
cat = {"invité fo": "Invité", "intervenant": "Intervenant", "inscrit": "Inscrit", "partenaire": "Partenaire"}

out = []
for line in DATA.strip().split("\n"):
    parts = [p.strip() for p in line.split("|")]
    while len(parts) < 7:
        parts.append("")
    ident, societe, civ, prenom, nom, fonction, pays = parts[:7]
    hon = civ if civ and civ not in ("Monsieur", "Madame") else ""
    name = " ".join((hon + " " + prenom + " " + nom).split())
    if not name:
        continue
    role = (fonction + " · " + societe) if fonction else societe
    role = role.strip(" ·")
    country = flag.get(pays, "🌍")
    interests = ", ".join(filter(None, [cat.get(ident.lower(), ""), "Ports & Logistique"]))
    out.append([name, role, country, interests])

with open("docs/participants_apf2026.csv", "w", encoding="utf-8", newline="") as f:
    w = csv.writer(f)
    w.writerow(["name", "role", "country", "interests"])
    w.writerows(out)

print(str(len(out)) + " participants -> docs/participants_apf2026.csv")
