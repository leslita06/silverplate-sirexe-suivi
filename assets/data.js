/* Stand 36 m2, SIREXE 2026. Montants alignés sur le devis du stand (10 675 600 FCFA HT, 12 597 208 FCFA TTC)
   et sur le rétroplanning logistique. Avancement, engagements et statuts : illustration. */
window.P = {
  today: '2026-11-06',
  jourJ: '2026-11-18',
  devisHT: 10675600, tva: 0.18, devisTTC: 12597208,
  acompte: 6298604, acompteRecu: '2026-10-19', solde: 6298604, soldeDate: '2026-11-25',
  personnes: {
    J: { nom: 'Jamal Wehaibi', court: 'Jamal', ini: 'JW', role: "Relation avec l'exposant, signatures, argent et arbitrages", c: '#262C51' },
    A: { nom: 'Alice Flis', court: 'Alice', ini: 'AF', role: 'Création, contenus, épreuves et hôtesses', c: '#4C63D2' },
    R: { nom: 'Arnaud Tavares', court: 'Arnaud', ini: 'AT', role: 'Commandes, logistique et terrain', c: '#0E7C86' }
  },
  /* devis = prix client HT ; budget = coût prestataires prévu ; engage = commandes fermes signées */
  lots: [
    { id: 'MEN', nom: 'Menuiserie et sol', devis: 3939000, budget: 3030000, engage: 3120000, av: 45, qui: 'R',
      etape: "Fabrication des cloisons et du totem à l'atelier", prochaine: 'livraison sur site le 15/11', etat: 'surcout',
      note: 'Moquette dans la couleur de l\'exposant : +90 000 FCFA HT' },
    { id: 'IMP', nom: 'Impression', devis: 756600, budget: 582000, engage: 0, av: 25, qui: 'A',
      etape: 'Épreuves envoyées le 03/11, pas encore signées', alerte: "Impression : épreuves envoyées le 03/11, toujours pas signées.", prochaine: 'signature des épreuves, attendue le 04/11', etat: 'retard',
      note: 'Sans signature lundi 9, la livraison du 12/11 glisse' },
    { id: 'MOB', nom: 'Mobilier', devis: 1001000, budget: 770000, engage: 770000, av: 55, qui: 'R',
      etape: 'Comptoir en fabrication, location confirmée', prochaine: 'livraison le 17/11', etat: 'ok', note: '' },
    { id: 'ELE', nom: 'Électricité', devis: 845000, budget: 650000, engage: 650000, av: 40, qui: 'R',
      etape: "Commande écrite envoyée à l'organisateur le 30/10", prochaine: "accusé de l'organisateur, attendu le 04/11", etat: 'retard',
      alerte: "Électricité : accusé de l'organisateur attendu depuis le 04/11.", note: "Relance faite le 05/11. Sans accusé, le raccordement du 16/11 n'est pas garanti" },
    { id: 'ECR', nom: 'Écran', devis: 2249000, budget: 1730000, engage: 1730000, av: 35, qui: 'A',
      etape: 'Écran LED 3 x 1,7 m réservé le 04/11', prochaine: 'contenus en boucle à recevoir le 13/11', etat: 'ok', note: '' },
    { id: 'PER', nom: 'Personnel', devis: 1300000, budget: 1000000, engage: 800000, av: 50, qui: 'A',
      etape: 'Équipe de montage et démontage confirmée, 1 hôtesse sur 2', prochaine: 'seconde hôtesse à retenir le 06/11', etat: 'vigilance',
      note: '2 profils à départager' },
    { id: 'TRA', nom: 'Transport et assurance', devis: 585000, budget: 450000, engage: 300000, av: 40, qui: 'R',
      etape: 'Camion aller et retour réservé', prochaine: "attestation d'assurance le 10/11", etat: 'ok',
      note: "Devis de l'assureur reçu, à valider" }
  ],
  /* d = échéance, f = fin si période ; s : fait, cours, retard, avenir */
  taches: [
    { d: '2026-10-19', t: 'Devis signé, acompte de 50 % reçu (6 298 604 FCFA TTC)', lot: 'Projet', q: 'J', s: 'fait' },
    { d: '2026-10-21', t: "Guide de l'exposant récupéré : horaires, portes, puissance, sécurité", lot: 'Projet', q: 'J', s: 'fait' },
    { d: '2026-10-28', t: "Plans du stand validés par l'exposant", lot: 'Menuiserie et sol', q: 'A', s: 'fait' },
    { d: '2026-10-28', t: 'Commande ferme menuiserie, sol et comptoir sur mesure', lot: 'Menuiserie et sol', q: 'R', s: 'fait' },
    { d: '2026-10-30', t: "Bilan de puissance fait, commande d'électricité envoyée", lot: 'Électricité', q: 'R', s: 'fait' },
    { d: '2026-11-04', t: 'Écran LED réservé pour les 5 jours du salon', lot: 'Écran', q: 'R', s: 'fait' },
    { d: '2026-11-04', t: 'Mobilier loué et camion réservés, confirmations écrites', lot: 'Mobilier', q: 'R', s: 'fait' },
    { d: '2026-11-04', t: "Épreuves d'impression signées par l'exposant", lot: 'Impression', q: 'A', s: 'retard' },
    { d: '2026-11-04', t: "Accusé de l'organisateur sur la commande d'électricité", lot: 'Électricité', q: 'R', s: 'retard' },
    { d: '2026-11-06', t: 'Hôtesses retenues, noms et tailles de tenue reçus', lot: 'Personnel', q: 'A', s: 'cours' },
    { d: '2026-11-06', t: 'Surcoût de la moquette : accepter ou revenir au standard', lot: 'Menuiserie et sol', q: 'J', s: 'cours' },
    { d: '2026-11-09', t: 'Listes nominatives des monteurs, hôtesses et véhicules déposées', lot: 'Personnel', q: 'R', s: 'avenir' },
    { d: '2026-11-10', t: "Attestation d'assurance du stand et du matériel reçue", lot: 'Transport et assurance', q: 'J', s: 'avenir' },
    { d: '2026-11-12', t: "Impressions livrées à l'atelier, contrôlées contre l'épreuve", lot: 'Impression', q: 'R', s: 'avenir' },
    { d: '2026-11-13', t: "Contenus de l'écran reçus et lus en boucle à l'atelier", lot: 'Écran', q: 'A', s: 'avenir' },
    { d: '2026-11-14', t: 'Badges retirés et comptés, camion chargé selon la liste', lot: 'Transport et assurance', q: 'R', s: 'avenir' },
    { d: '2026-11-15', f: '2026-11-17', t: "Montage en 3 jours avec l'équipe de 6", lot: 'Montage', q: 'R', s: 'avenir' },
    { d: '2026-11-17', t: "Visite de réception avec l'exposant, procès-verbal signé", lot: 'Projet', q: 'J', s: 'avenir' },
    { d: '2026-11-18', t: 'Ouverture du salon : stand prêt 1 h avant, check-list du matin', lot: 'Salon', q: 'A', s: 'avenir' },
    { d: '2026-11-18', f: '2026-11-22', t: 'Point de 5 lignes chaque soir du salon', lot: 'Salon', q: 'A', s: 'avenir' },
    { d: '2026-11-23', t: 'Démontage, retours des loueurs, état des lieux de sortie', lot: 'Démontage', q: 'R', s: 'avenir' },
    { d: '2026-11-25', t: "Bilan avec l'exposant, facture de solde (6 298 604 FCFA TTC)", lot: 'Projet', q: 'J', s: 'avenir' },
    { d: '2026-11-25', t: 'Réutilisable rangé à l\'atelier, écarts et coûts imprévus remontés', lot: 'Démontage', q: 'R', s: 'avenir' }
  ]
};
