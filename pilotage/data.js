/* Stand 36 m2, SIREXE 2026. Montants alignés sur le devis du stand (10 675 600 FCFA HT, 12 597 208 FCFA TTC)
   et sur le rétroplanning logistique. Avancement, engagements, statuts et éléments attendus : illustration. */
window.P = {
  version: 1,
  today: '2026-11-06',
  jourJ: '2026-11-18',
  debut: '2026-09-19',
  fin: '2026-11-25',
  devisHT: 10675600, tva: 0.18, devisTTC: 12597208,
  acompte: 6298604, solde: 6298604,
  personnes: {
    J: { nom: 'Jamal Wehaibi', court: 'Jamal', ini: 'JW', c: '#262C51' },
    A: { nom: 'Alice Flis', court: 'Alice', ini: 'AF', c: '#4C63D2' },
    R: { nom: 'Arnaud Tavares', court: 'Arnaud', ini: 'AT', c: '#0E7C86' }
  },
  /* devis = prix client HT ; budget = coût prestataires prévu ; engage = commandes fermes signées */
  lots: [
    { nom: 'Menuiserie et sol', devis: 3939000, budget: 3030000, engage: 3120000 },
    { nom: 'Impression', devis: 756600, budget: 582000, engage: 0 },
    { nom: 'Mobilier', devis: 1001000, budget: 770000, engage: 770000 },
    { nom: 'Électricité', devis: 845000, budget: 650000, engage: 650000 },
    { nom: 'Écran', devis: 2249000, budget: 1730000, engage: 1730000 },
    { nom: 'Personnel', devis: 1300000, budget: 1000000, engage: 800000 },
    { nom: 'Transport et assurance', devis: 585000, budget: 450000, engage: 300000 }
  ],
  phases: [
    { nom: 'Avant-projet', d: '2026-09-19', f: '2026-10-18', c: '#EEF1F7' },
    { nom: 'Conception et commandes', d: '2026-10-19', f: '2026-11-06', c: '#E1E6F5' },
    { nom: 'Préparation', d: '2026-11-07', f: '2026-11-14', c: '#DDEFF0' },
    { nom: 'Montage', d: '2026-11-15', f: '2026-11-17', c: '#FBE9D0' },
    { nom: 'Salon', d: '2026-11-18', f: '2026-11-22', c: '#F8D9B4' },
    { nom: 'Démontage', d: '2026-11-23', f: '2026-11-25', c: '#ECEFF3' }
  ],
  /* d = échéance, f = fin si période ; s = colonne de départ : afaire, cours, fait ; j = jalon */
  taches: [
    { id: 'T01', d: '2026-09-19', t: "Brief de l'exposant reçu : surface, objectifs, budget", lot: 'Projet', q: 'J', s: 'fait', j: 'Brief' },
    { id: 'T02', d: '2026-09-25', t: "Surface de 36 m² réservée par l'exposant auprès de l'organisateur", lot: 'Projet', q: 'J', s: 'fait' },
    { id: 'T03', d: '2026-09-30', t: "Pistes créatives et plan d'implantation présentés", lot: 'Projet', q: 'A', s: 'fait' },
    { id: 'T04', d: '2026-10-07', t: 'Prix demandés aux prestataires, trois par lot', lot: 'Projet', q: 'R', s: 'fait' },
    { id: 'T05', d: '2026-10-10', t: 'Devis du stand envoyé : 10 675 600 FCFA HT', lot: 'Projet', q: 'J', s: 'fait' },
    { id: 'T06', d: '2026-10-15', t: "Ajustements du devis validés par l'exposant", lot: 'Projet', q: 'J', s: 'fait' },
    { id: 'T07', d: '2026-10-19', t: 'Devis signé, acompte de 50 % reçu (6 298 604 FCFA TTC)', lot: 'Projet', q: 'J', s: 'fait', j: 'Devis signé' },
    { id: 'T08', d: '2026-10-21', t: "Guide de l'exposant récupéré : horaires, portes, puissance, sécurité", lot: 'Projet', q: 'J', s: 'fait' },
    { id: 'T09', d: '2026-10-28', t: "Plans du stand validés par l'exposant", lot: 'Menuiserie et sol', q: 'A', s: 'fait', j: 'Plans validés' },
    { id: 'T10', d: '2026-10-28', t: 'Commande ferme menuiserie, sol et comptoir sur mesure', lot: 'Menuiserie et sol', q: 'R', s: 'fait' },
    { id: 'T11', d: '2026-10-30', t: "Bilan de puissance fait, commande d'électricité envoyée", lot: 'Électricité', q: 'R', s: 'fait' },
    { id: 'T12', d: '2026-11-03', t: "Épreuves d'impression envoyées à l'exposant", lot: 'Impression', q: 'A', s: 'fait' },
    { id: 'T13', d: '2026-11-04', t: "Épreuves d'impression signées par l'exposant", lot: 'Impression', q: 'A', s: 'cours', j: 'Épreuves signées' },
    { id: 'T14', d: '2026-11-04', t: "Accusé de l'organisateur sur la commande d'électricité", lot: 'Électricité', q: 'R', s: 'cours' },
    { id: 'T15', d: '2026-11-04', t: 'Écran LED réservé pour les 5 jours du salon', lot: 'Écran', q: 'R', s: 'fait' },
    { id: 'T16', d: '2026-11-04', t: 'Mobilier loué et camion réservés, confirmations écrites', lot: 'Mobilier', q: 'R', s: 'fait' },
    { id: 'T17', d: '2026-11-06', t: 'Hôtesses retenues, noms et tailles de tenue reçus', lot: 'Personnel', q: 'A', s: 'cours' },
    { id: 'T18', d: '2026-11-06', t: 'Surcoût de la moquette : accepter ou revenir au standard', lot: 'Menuiserie et sol', q: 'J', s: 'cours' },
    { id: 'T19', d: '2026-11-09', t: 'Listes nominatives des monteurs, hôtesses et véhicules déposées', lot: 'Personnel', q: 'R', s: 'afaire' },
    { id: 'T20', d: '2026-11-10', t: "Attestation d'assurance du stand et du matériel reçue", lot: 'Transport et assurance', q: 'J', s: 'afaire' },
    { id: 'T21', d: '2026-11-12', t: "Impressions livrées à l'atelier, contrôlées contre l'épreuve", lot: 'Impression', q: 'R', s: 'afaire' },
    { id: 'T22', d: '2026-11-13', t: "Contenus de l'écran reçus et lus en boucle à l'atelier", lot: 'Écran', q: 'A', s: 'afaire' },
    { id: 'T23', d: '2026-11-14', t: 'Badges retirés et comptés, camion chargé selon la liste', lot: 'Transport et assurance', q: 'R', s: 'afaire', j: 'Camion chargé' },
    { id: 'T24', d: '2026-11-15', f: '2026-11-17', t: "Montage en 3 jours avec l'équipe de 6", lot: 'Montage', q: 'R', s: 'afaire', j: 'Montage' },
    { id: 'T25', d: '2026-11-16', t: "Raccordement par l'électricien du salon, chaque circuit testé", lot: 'Électricité', q: 'R', s: 'afaire' },
    { id: 'T26', d: '2026-11-17', t: 'Mobilier et comptoir livrés, pointés contre le bon', lot: 'Mobilier', q: 'R', s: 'afaire' },
    { id: 'T27', d: '2026-11-17', t: "Visite de réception avec l'exposant, procès-verbal signé", lot: 'Projet', q: 'J', s: 'afaire', j: 'Réception' },
    { id: 'T28', d: '2026-11-18', t: 'Ouverture du salon : stand prêt 1 h avant, check-list du matin', lot: 'Salon', q: 'A', s: 'afaire', j: 'Ouverture' },
    { id: 'T29', d: '2026-11-18', f: '2026-11-22', t: 'Point de 5 lignes chaque soir du salon', lot: 'Salon', q: 'A', s: 'afaire' },
    { id: 'T30', d: '2026-11-23', t: 'Démontage, retours des loueurs, état des lieux de sortie', lot: 'Démontage', q: 'R', s: 'afaire', j: 'Démontage' },
    { id: 'T31', d: '2026-11-25', t: "Bilan avec l'exposant, facture de solde (6 298 604 FCFA TTC)", lot: 'Projet', q: 'J', s: 'afaire', j: 'Bilan' },
    { id: 'T32', d: '2026-11-25', t: "Réutilisable rangé à l'atelier, écarts et coûts imprévus remontés", lot: 'Démontage', q: 'R', s: 'afaire' }
  ],
  /* éléments attendus de l'exposant : dem = demandé le, att = attendu pour le, recu = date de réception */
  client: [
    { id: 'C01', nom: 'Acompte de 50 % (6 298 604 FCFA TTC)', dem: '2026-10-15', att: '2026-10-19', recu: '2026-10-19', q: 'J', pq: 'Il déclenche les commandes aux prestataires.' },
    { id: 'C02', nom: 'Attestation de réservation de la surface', dem: '2026-10-19', att: '2026-10-23', recu: '2026-10-22', q: 'J', pq: "Elle confirme l'emplacement auprès de l'organisateur." },
    { id: 'C03', nom: 'Logo en haute définition et charte graphique', dem: '2026-10-19', att: '2026-10-22', recu: '2026-10-22', q: 'A', pq: "Il sert aux impressions, à l'enseigne et à l'écran." },
    { id: 'C04', nom: 'Validation des plans du stand', dem: '2026-10-24', att: '2026-10-28', recu: '2026-10-28', q: 'A', pq: 'Elle lance la fabrication des cloisons et du totem.' },
    { id: 'C05', nom: "Textes des cloisons et de l'enseigne", dem: '2026-10-24', att: '2026-10-31', recu: '2026-10-31', q: 'A', pq: "Ils entrent dans les épreuves d'impression." },
    { id: 'C06', nom: "Signature des épreuves d'impression", dem: '2026-11-03', att: '2026-11-04', recu: '', q: 'A', pq: 'Sans elle, les impressions ne seront pas livrées le 12/11.' },
    { id: 'C07', nom: 'Liste des invités du cocktail sur le stand', dem: '2026-10-28', att: '2026-11-05', recu: '', q: 'J', pq: 'Elle fixe le nombre de verres, de pièces et les invitations.' },
    { id: 'C08', nom: "Noms de l'équipe de l'exposant, pour les badges", dem: '2026-11-02', att: '2026-11-07', recu: '', q: 'R', pq: "Les listes partent à l'organisateur le 09/11." },
    { id: 'C09', nom: 'Documents, goodies et produits à exposer', dem: '2026-11-03', att: '2026-11-12', recu: '', q: 'R', pq: 'Ils partent dans le camion du 14/11.' },
    { id: 'C10', nom: "Vidéos et visuels de la boucle de l'écran", dem: '2026-10-30', att: '2026-11-13', recu: '', q: 'A', pq: "Ils doivent être lus en boucle à l'atelier avant le montage." }
  ]
};
