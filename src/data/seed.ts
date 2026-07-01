import type { ItemInput } from '@/types'

type SeedItem = Omit<ItemInput, 'module'> & { module: ItemInput['module'] }

function echeancier(
  title: string,
  opts: Partial<SeedItem> = {},
): SeedItem {
  return {
    module: 'echeancier',
    title,
    status: 'a_faire',
    priority: 'moyenne',
    ...opts,
  }
}

function demarche(title: string, organisme: string, opts: Partial<SeedItem> = {}): SeedItem {
  return {
    module: 'demarches',
    title,
    status: 'a_faire',
    priority: 'moyenne',
    data: { organisme, ...opts.data },
    category: opts.category ?? 'Adresse',
    ...opts,
  }
}

function carton(title: string, opts: Partial<SeedItem> = {}): SeedItem {
  return {
    module: 'cartons',
    title,
    status: 'a_faire',
    priority: 'p2',
    data: { fragile: false, a_demonter: false, transport: 'Camion', ...opts.data },
    ...opts,
  }
}

function voiture(title: string, voitureName: string, opts: Partial<SeedItem> = {}): SeedItem {
  return {
    module: 'voitures',
    title,
    status: 'a_preparer',
    priority: 'important',
    category: opts.category ?? 'Documents',
    data: { voiture: voitureName, indispensable: false, ...opts.data },
    ...opts,
  }
}

function document(title: string, opts: Partial<SeedItem> = {}): SeedItem {
  return {
    module: 'documents',
    title,
    status: 'a_recuperer',
    priority: 'haute',
    data: { version_papier: false, version_numerique: false, ...opts.data },
    ...opts,
  }
}

function contact(title: string, opts: Partial<SeedItem> = {}): SeedItem {
  return {
    module: 'contacts',
    title,
    status: 'a_contacter',
    priority: 'moyenne',
    data: { personne: '', telephone: '', email: '', role: '', ...opts.data },
    ...opts,
  }
}

function verification(title: string, jour: string, opts: Partial<SeedItem> = {}): SeedItem {
  return {
    module: 'verifications',
    title,
    status: 'a_verifier',
    priority: 'haute',
    data: { jour, moment: 'Matin', lieu: 'Maison', ...opts.data },
    ...opts,
  }
}

function budget(title: string, montant: number, opts: Partial<SeedItem> = {}): SeedItem {
  return {
    module: 'budget',
    title,
    status: 'a_faire',
    priority: 'moyenne',
    data: {
      montant_estime: montant,
      montant_reel: 0,
      paye: false,
      justificatif_conserve: false,
      moyen_paiement: '',
      ...opts.data,
    },
    ...opts,
  }
}

export const SEED_ITEMS: SeedItem[] = [
  // Échéancier
  echeancier('Signer le bail de l\'appartement', { category: 'Logement', priority: 'haute', period: 'Avant 11 juillet' }),
  echeancier('Signer le compromis de vente', { category: 'Vente', priority: 'haute', period: 'Avant 11 juillet' }),
  echeancier('Confirmer définitivement le déménageur', { category: 'Déménageur', priority: 'haute', period: '11-17 juillet' }),
  echeancier('Récupérer les cartons', { category: 'Cartons', period: '11-17 juillet' }),
  echeancier('Vérifier contrat ENGIE nouvel appartement', { category: 'Énergie', period: '11-17 juillet' }),
  echeancier('Vérifier assurance habitation appartement', { category: 'Assurance', priority: 'haute', period: '11-17 juillet' }),
  echeancier('Programmer réexpédition La Poste', { category: 'Administratif', period: '11-17 juillet' }),
  echeancier('Faire changement d\'adresse Service-public', { category: 'Administratif', period: '11-17 juillet' }),
  echeancier('Finaliser inscription école', { category: 'École', priority: 'haute', period: '18-24 juillet' }),
  echeancier('Finaliser inscription périscolaire', { category: 'École', period: '18-24 juillet' }),
  echeancier('Préparer valise vacances de Julie', { category: 'Cartons', period: '18-24 juillet' }),
  echeancier('Trier chambre de Julie', { category: 'Cartons', period: '18-24 juillet' }),
  echeancier('Trier garage', { category: 'Cartons', period: '18-24 juillet' }),
  echeancier('Trier dressing', { category: 'Cartons', period: '18-24 juillet' }),
  echeancier('Faire cartons chambres secondaires', { category: 'Cartons', period: '18-24 juillet' }),
  echeancier('Faire cartons buanderie', { category: 'Cartons', period: '18-24 juillet' }),
  echeancier('Faire cartons cuisine non essentielle', { category: 'Cartons', period: '18-24 juillet' }),
  echeancier('Vérifier transfert / résiliation internet', { category: 'Internet', period: '18-24 juillet' }),
  echeancier('Préparer documents état des lieux', { category: 'Logement', priority: 'haute', period: '25-28 juillet' }),
  echeancier('Préparer voiture 1 documents / valeurs', { category: 'Voitures', priority: 'haute', period: '25-28 juillet' }),
  echeancier('Préparer voiture 2 première nuit', { category: 'Voitures', priority: 'haute', period: '25-28 juillet' }),
  echeancier('Confirmer heure d\'arrivée déménageur', { category: 'Déménageur', priority: 'haute', period: '25-28 juillet' }),
  echeancier('Vider frigo / congélateur', { category: 'Cartons', period: '25-28 juillet' }),
  echeancier('Préparer eau / repas / café pour le 29', { category: 'Voitures', period: '25-28 juillet' }),
  echeancier('Déménagement maison', { category: 'Logement', priority: 'haute', period: '29 juillet', due_date: '2026-07-29' }),
  echeancier('État des lieux appartement', { category: 'Logement', priority: 'haute', period: '30 juillet', due_date: '2026-07-30' }),
  echeancier('Relever compteurs appartement', { category: 'Énergie', priority: 'haute', period: '30 juillet', due_date: '2026-07-30' }),
  echeancier('Faire photos appartement', { category: 'Logement', period: '30 juillet', due_date: '2026-07-30' }),

  // Démarches
  demarche('Programmer la réexpédition courrier', 'La Poste', { category: 'Adresse' }),
  demarche('Faire changement d\'adresse', 'Service-public', { category: 'Adresse' }),
  demarche('Prévenir les impôts', 'Impôts', { category: 'Adresse' }),
  demarche('Modifier adresse CPAM / Ameli', 'Ameli', { category: 'Santé' }),
  demarche('Modifier adresse mutuelle', 'Mutuelle', { category: 'Santé' }),
  demarche('Prévenir banque', 'Banque', { category: 'Banque' }),
  demarche('Assurance habitation appartement', 'Assurance', { category: 'Assurance', priority: 'haute' }),
  demarche('Garder assurance maison jusqu\'à vente définitive', 'Assurance', { category: 'Assurance' }),
  demarche('Modifier assurance auto', 'Assurance auto', { category: 'Assurance' }),
  demarche('Changer adresse carte grise', 'ANTS', { category: 'Véhicules' }),
  demarche('Vérifier contrat électricité appartement', 'ENGIE', { category: 'Énergie', priority: 'haute' }),
  demarche('Relever compteur appartement', 'ENGIE', { category: 'Énergie' }),
  demarche('Relever compteur maison', 'Fournisseur actuel', { category: 'Énergie' }),
  demarche('Transfert / résiliation internet', 'Opérateur', { category: 'Internet' }),
  demarche('Finaliser inscription école', 'École de Julie', { category: 'École', priority: 'haute' }),
  demarche('Finaliser inscription périscolaire', 'Périscolaire', { category: 'École' }),
  demarche('Assurance scolaire Julie', 'Assurance', { category: 'École' }),
  demarche('Prévenir rectorat / employeur', 'Employeur', { category: 'Employeur' }),
  demarche('Modifier adresse Amazon', 'Amazon', { category: 'Abonnements' }),
  demarche('Modifier adresse Vinted', 'Vinted', { category: 'Abonnements' }),
  demarche('Modifier adresse abonnements livraison', 'Divers', { category: 'Abonnements' }),
  demarche('Prévenir opérateur téléphone si nécessaire', 'Opérateur', { category: 'Abonnements' }),

  // Cartons
  carton('Carton cuisine 1 — vaisselle quotidienne', { priority: 'p1', data: { piece_actuelle: 'Salon-cuisine', piece_arrivee: 'Cuisine', contenu: 'Vaisselle quotidienne' } }),
  carton('Carton cuisine 2 — casseroles', { data: { piece_actuelle: 'Salon-cuisine', piece_arrivee: 'Cuisine', contenu: 'Casseroles' } }),
  carton('Carton cuisine 3 — vaisselle fragile', { data: { piece_actuelle: 'Salon-cuisine', piece_arrivee: 'Cuisine', contenu: 'Vaisselle fragile', fragile: true }, priority: 'p1' }),
  carton('Carton salle de bain — serviettes', { data: { piece_actuelle: 'Salle de bain', piece_arrivee: 'Salle de bain', contenu: 'Serviettes' }, priority: 'p1' }),
  carton('Carton salle de bain — produits ouverts', { data: { piece_actuelle: 'Salle de bain', piece_arrivee: 'Salle de bain', contenu: 'Produits ouverts' } }),
  carton('Carton chambre Julie — vêtements', { data: { piece_actuelle: 'Chambre Julie', piece_arrivee: 'Chambre Julie', contenu: 'Vêtements' }, priority: 'p1' }),
  carton('Carton chambre Julie — jeux / livres', { data: { piece_actuelle: 'Chambre Julie', piece_arrivee: 'Chambre Julie', contenu: 'Jeux / livres' } }),
  carton('Carton dressing — vêtements été', { data: { piece_actuelle: 'Dressing', piece_arrivee: 'Dressing', contenu: 'Vêtements été' } }),
  carton('Carton dressing — vêtements hors saison', { data: { piece_actuelle: 'Dressing', piece_arrivee: 'Cave / stockage', contenu: 'Vêtements hors saison' }, priority: 'p3' }),
  carton('Carton garage — outils', { data: { piece_actuelle: 'Garage', piece_arrivee: 'Garage', contenu: 'Outils' } }),
  carton('Carton garage — sport / EPS', { data: { piece_actuelle: 'Garage', piece_arrivee: 'Garage', contenu: 'Sport / EPS' } }),
  carton('Carton papiers importants', { data: { piece_actuelle: 'Salon-cuisine', piece_arrivee: 'Chambre parents', contenu: 'Papiers importants', transport: 'Voiture 1' }, priority: 'p1' }),
  carton('Télé / box / câbles', { data: { piece_actuelle: 'Salon-cuisine', piece_arrivee: 'Salon', contenu: 'Télé, box, câbles', a_demonter: true, fragile: true } }),
  carton('Lit parents', { data: { piece_actuelle: 'Chambre parents', piece_arrivee: 'Chambre parents', a_demonter: true, transport: 'Camion' }, priority: 'p1' }),
  carton('Lit Julie', { data: { piece_actuelle: 'Chambre Julie', piece_arrivee: 'Chambre Julie', a_demonter: true }, priority: 'p1' }),
  carton('Machine à laver', { data: { piece_actuelle: 'Buanderie', piece_arrivee: 'Buanderie', a_demonter: false } }),
  carton('Produits ménagers', { data: { piece_actuelle: 'Buanderie', piece_arrivee: 'Buanderie', contenu: 'Produits ménagers' }, priority: 'p1' }),
  carton('Aspirateur / serpillière', { data: { piece_actuelle: 'Buanderie', piece_arrivee: 'Buanderie', transport: 'Voiture 2' }, priority: 'p1' }),

  // Voiture 1
  voiture('Papiers d\'identité', 'Voiture 1', { category: 'Documents', priority: 'indispensable', data: { indispensable: true } }),
  voiture('Bail appartement', 'Voiture 1', { category: 'Documents', priority: 'indispensable', data: { indispensable: true } }),
  voiture('Attestation assurance habitation', 'Voiture 1', { category: 'Documents', priority: 'indispensable', data: { indispensable: true } }),
  voiture('Compromis de vente', 'Voiture 1', { category: 'Documents', priority: 'indispensable', data: { indispensable: true } }),
  voiture('Documents notaire', 'Voiture 1', { category: 'Documents', priority: 'indispensable', data: { indispensable: true } }),
  voiture('Livret de famille', 'Voiture 1', { category: 'Documents', priority: 'indispensable', data: { indispensable: true } }),
  voiture('Documents école Julie', 'Voiture 1', { category: 'Julie', priority: 'indispensable', data: { indispensable: true } }),
  voiture('Carte Vitale / mutuelle', 'Voiture 1', { category: 'Santé', priority: 'indispensable', data: { indispensable: true } }),
  voiture('Médicaments', 'Voiture 1', { category: 'Santé', priority: 'indispensable', data: { indispensable: true } }),
  voiture('Ordinateurs', 'Voiture 1', { category: 'Électronique', priority: 'indispensable', data: { indispensable: true } }),
  voiture('Disques durs / clés USB', 'Voiture 1', { category: 'Électronique', priority: 'indispensable', data: { indispensable: true } }),
  voiture('Chargeurs principaux', 'Voiture 1', { category: 'Électronique', priority: 'important' }),
  voiture('Bijoux / objets de valeur', 'Voiture 1', { category: 'Valeurs', priority: 'indispensable', data: { indispensable: true } }),
  voiture('Clés maison / appartement', 'Voiture 1', { category: 'Documents', priority: 'indispensable', data: { indispensable: true } }),
  voiture('Moyens de paiement', 'Voiture 1', { category: 'Valeurs', priority: 'indispensable', data: { indispensable: true } }),

  // Voiture 2
  voiture('Draps parents', 'Voiture 2', { category: 'Première nuit', priority: 'indispensable', data: { indispensable: true } }),
  voiture('Draps Julie', 'Voiture 2', { category: 'Première nuit', priority: 'indispensable', data: { indispensable: true } }),
  voiture('Oreillers', 'Voiture 2', { category: 'Première nuit', priority: 'indispensable', data: { indispensable: true } }),
  voiture('Serviettes', 'Voiture 2', { category: 'Hygiène', priority: 'indispensable', data: { indispensable: true } }),
  voiture('Papier toilette', 'Voiture 2', { category: 'Hygiène', priority: 'important' }),
  voiture('Trousse de toilette', 'Voiture 2', { category: 'Hygiène', priority: 'important' }),
  voiture('Produits d\'entretien', 'Voiture 2', { category: 'Outils', priority: 'important' }),
  voiture('Sacs-poubelle', 'Voiture 2', { category: 'Outils', priority: 'confort' }),
  voiture('Multiprises', 'Voiture 2', { category: 'Outils', priority: 'important' }),
  voiture('Petit outillage', 'Voiture 2', { category: 'Outils', priority: 'important' }),
  voiture('Café / petit-déjeuner', 'Voiture 2', { category: 'Nourriture', priority: 'indispensable', data: { indispensable: true } }),
  voiture('Eau / repas jour J', 'Voiture 2', { category: 'Nourriture', priority: 'indispensable', data: { indispensable: true } }),
  voiture('Assiettes / verres / couverts minimum', 'Voiture 2', { category: 'Nourriture', priority: 'important' }),
  voiture('Affaires de Julie pour retour', 'Voiture 2', { category: 'Julie', priority: 'important' }),
  voiture('Vêtements 2 jours', 'Voiture 2', { category: 'Première nuit', priority: 'indispensable', data: { indispensable: true } }),

  // Documents
  document('Bail appartement', { category: 'Appartement', priority: 'haute' }),
  document('Attestation assurance habitation appartement', { category: 'Assurance', priority: 'haute' }),
  document('Compromis de vente', { category: 'Vente', priority: 'haute' }),
  document('Documents notaire', { category: 'Vente' }),
  document('Devis déménageur', { category: 'Déménageur' }),
  document('Preuve arrhes déménageur', { category: 'Déménageur' }),
  document('État des lieux appartement', { category: 'Appartement', priority: 'haute' }),
  document('Contrat ENGIE', { category: 'Énergie' }),
  document('Relevé compteur maison', { category: 'Maison' }),
  document('Relevé compteur appartement', { category: 'Appartement' }),
  document('Inscription école Julie', { category: 'École', priority: 'haute' }),
  document('Inscription périscolaire', { category: 'École' }),
  document('Assurance scolaire', { category: 'École' }),
  document('Livret de famille', { category: 'Identité', priority: 'haute' }),
  document('Pièces d\'identité', { category: 'Identité', priority: 'haute' }),
  document('RIB', { category: 'Identité' }),
  document('Carnet de santé / documents santé utiles', { category: 'Santé' }),
  document('Certificat de radiation ancienne école si demandé', { category: 'École' }),

  // Contacts
  contact('Déménageur', { category: 'Déménageur' }),
  contact('Propriétaire / agence appartement', { category: 'Propriétaire' }),
  contact('Notaire', { category: 'Notaire' }),
  contact('Mairie de Lorgues — service scolaire', { category: 'Mairie' }),
  contact('École de Julie', { category: 'École', priority: 'haute' }),
  contact('Périscolaire', { category: 'École' }),
  contact('Assurance habitation', { category: 'Assurance' }),
  contact('ENGIE', { category: 'Énergie' }),
  contact('Opérateur internet', { category: 'Internet' }),
  contact('Banque', { category: 'Banque' }),
  contact('Assurance auto', { category: 'Assurance' }),

  // Vérifications 28 juillet
  verification('Tous les cartons P1 identifiés', '28 juillet', { data: { moment: 'Matin', lieu: 'Maison' } }),
  verification('Documents dans voiture 1', '28 juillet', { data: { moment: 'Matin', lieu: 'Voiture 1' } }),
  verification('Médicaments hors carton', '28 juillet', { data: { moment: 'Matin', lieu: 'Maison' } }),
  verification('Chargeurs hors carton', '28 juillet', { data: { moment: 'Matin', lieu: 'Maison' } }),
  verification('Vêtements 2 jours prêts', '28 juillet', { data: { moment: 'Matin', lieu: 'Dressing' } }),
  verification('Draps / oreillers prêts', '28 juillet', { data: { moment: 'Matin', lieu: 'Chambre parents' } }),
  verification('Frigo presque vide', '28 juillet', { data: { moment: 'Midi', lieu: 'Maison' } }),
  verification('Congélateur vidé', '28 juillet', { data: { moment: 'Midi', lieu: 'Maison' } }),
  verification('Outils / multiprises prêts', '28 juillet', { data: { moment: 'Après-midi', lieu: 'Garage' } }),
  verification('Eau / repas pour jour J', '28 juillet', { data: { moment: 'Après-midi', lieu: 'Maison' } }),
  verification('Clés maison / appartement identifiées', '28 juillet', { data: { moment: 'Soir', lieu: 'Maison' } }),
  verification('Heure déménageur confirmée', '28 juillet', { data: { moment: 'Soir', lieu: 'Maison' }, priority: 'haute' }),
  verification('Stationnement camion vérifié', '28 juillet', { data: { moment: 'Soir', lieu: 'Maison' } }),

  // Vérifications 29 juillet
  verification('Relever compteur maison', '29 juillet', { data: { moment: 'Matin', lieu: 'Maison' }, priority: 'haute' }),
  verification('Photos maison avant départ', '29 juillet', { data: { moment: 'Matin', lieu: 'Maison' } }),
  verification('Dernier tour garage', '29 juillet', { data: { moment: 'Matin', lieu: 'Garage' } }),
  verification('Dernier tour dressing', '29 juillet', { data: { moment: 'Matin', lieu: 'Dressing' } }),
  verification('Dernier tour placards cuisine', '29 juillet', { data: { moment: 'Midi', lieu: 'Maison' } }),
  verification('Dernier tour salle de bain', '29 juillet', { data: { moment: 'Midi', lieu: 'Maison' } }),
  verification('Voiture 1 chargée', '29 juillet', { data: { moment: 'Après-midi', lieu: 'Voiture 1' }, priority: 'haute' }),
  verification('Voiture 2 chargée', '29 juillet', { data: { moment: 'Après-midi', lieu: 'Voiture 2' }, priority: 'haute' }),
  verification('Cartons fragiles signalés au déménageur', '29 juillet', { data: { moment: 'Après-midi', lieu: 'Camion' } }),
  verification('Rien d\'important dans le camion par erreur', '29 juillet', { data: { moment: 'Après-midi', lieu: 'Camion' }, priority: 'haute' }),
  verification('Maison fermée / fenêtres fermées', '29 juillet', { data: { moment: 'Soir', lieu: 'Maison' }, priority: 'haute' }),
  verification('Poubelles sorties / vidées', '29 juillet', { data: { moment: 'Soir', lieu: 'Maison' } }),

  // Vérifications 30 juillet
  verification('Attestation assurance disponible', '30 juillet', { data: { moment: 'Matin', lieu: 'Voiture 1' }, priority: 'haute' }),
  verification('Bail disponible', '30 juillet', { data: { moment: 'Matin', lieu: 'Voiture 1' }, priority: 'haute' }),
  verification('Photos état des lieux', '30 juillet', { data: { moment: 'Matin', lieu: 'Appartement' }, priority: 'haute' }),
  verification('Relever compteur appartement', '30 juillet', { data: { moment: 'Matin', lieu: 'Appartement' }, priority: 'haute' }),
  verification('Vérifier eau chaude', '30 juillet', { data: { moment: 'Matin', lieu: 'Appartement' } }),
  verification('Vérifier prises', '30 juillet', { data: { moment: 'Matin', lieu: 'Appartement' } }),
  verification('Vérifier fenêtres / volets', '30 juillet', { data: { moment: 'Après-midi', lieu: 'Appartement' } }),
  verification('Vérifier murs / sols / plafonds', '30 juillet', { data: { moment: 'Après-midi', lieu: 'Appartement' } }),
  verification('Vérifier nombre de clés / badges', '30 juillet', { data: { moment: 'Après-midi', lieu: 'Appartement' }, priority: 'haute' }),
  verification('Mettre noms sur boîte aux lettres', '30 juillet', { data: { moment: 'Après-midi', lieu: 'Appartement' } }),
  verification('Installer lits en priorité', '30 juillet', { data: { moment: 'Soir', lieu: 'Appartement' }, priority: 'haute' }),
  verification('Ouvrir cartons P1', '30 juillet', { data: { moment: 'Soir', lieu: 'Appartement' }, priority: 'haute' }),

  // Budget
  budget('Arrhes déménageur', 500, { category: 'Déménageur', data: { paye: false } }),
  budget('Solde déménageur', 2000, { category: 'Déménageur' }),
  budget('Réexpédition La Poste', 80, { category: 'Administratif' }),
  budget('Assurance habitation appartement', 300, { category: 'Logement' }),
  budget('Essence voitures', 150, { category: 'Transport' }),
  budget('Péages', 50, { category: 'Transport' }),
  budget('Cartons / adhésif / papier bulle', 80, { category: 'Équipement' }),
  budget('Produits de nettoyage', 40, { category: 'Nettoyage' }),
  budget('Repas jour J', 60, { category: 'Repas' }),
  budget('Petits achats appartement', 100, { category: 'Équipement' }),
  budget('Double de clés si besoin', 30, { category: 'Logement' }),
  budget('Matériel installation : multiprises, ampoules, sacs-poubelle', 50, { category: 'Équipement' }),
]
