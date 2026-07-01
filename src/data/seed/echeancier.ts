import { echeancier } from './helpers'

const P = {
  avant: 'Avant 11 juillet',
  s1: '11-17 juillet',
  s2: '18-24 juillet',
  s3: '25-28 juillet',
  j29: '29 juillet',
  j30: '30 juillet',
  apres: 'Après emménagement',
} as const

function roomTasks(
  room: string,
  period: string,
  tasks: string[],
  priority: 'haute' | 'moyenne' | 'basse' = 'moyenne',
) {
  return tasks.map((title) =>
    echeancier(title, { category: room, period, priority }),
  )
}

export const ECHEANCIER_SEED = [
  // ——— Avant 11 juillet ———
  echeancier('Signer le bail de l\'appartement', { category: 'Logement', priority: 'haute', period: P.avant, due_date: '2026-07-08' }),
  echeancier('Signer le compromis de vente', { category: 'Vente', priority: 'haute', period: P.avant, due_date: '2026-07-08' }),
  echeancier('Inventaire complet pièce par pièce (photo + liste)', { category: 'Cartons', priority: 'haute', period: P.avant }),
  echeancier('Commander / récupérer cartons, adhésif, papier bulle, marqueurs', { category: 'Cartons', period: P.avant }),
  echeancier('Confirmer date et horaire déménageur', { category: 'Déménageur', priority: 'haute', period: P.avant }),
  echeancier('Planifier stationnement camion (maison + appartement)', { category: 'Déménageur', period: P.avant }),
  echeancier('Lister meubles à démonter / remonter', { category: 'Cartons', period: P.avant }),
  echeancier('Prévoir garde des enfants pour le 29 juillet', { category: 'Enfants', priority: 'haute', period: P.avant }),
  echeancier('Réserver créneau état des lieux appartement', { category: 'Logement', priority: 'haute', period: P.avant }),

  // ——— 11-17 juillet : début tri (démarches → onglet Prépa) ———
  echeancier('Cocher les démarches urgentes dans Prépa', { category: 'Administratif', priority: 'haute', period: P.s1 }),
  echeancier('Inventorier et trier la cave (bouteilles + cartons)', { category: 'Cave', priority: 'haute', period: P.s1 }),
  echeancier('Lister bouteilles cave : garder / offrir / vendre', { category: 'Cave', period: P.s1 }),
  echeancier('Préparer cartons renforcés pour bouteilles cave', { category: 'Cave', period: P.s1 }),
  echeancier('Trier abri de jardin (outils, mobilier)', { category: 'Abri de jardin', period: P.s1 }),
  echeancier('Trier garage (premier passage)', { category: 'Garage', period: P.s1 }),
  echeancier('Trier dressing couloir (vêtements hors saison)', { category: 'Dressing', period: P.s1 }),
  echeancier('Commencer tri salon-cuisine (non essentiel)', { category: 'Salon-cuisine', period: P.s1 }),

  // ——— 18-24 juillet : cartonnage intensif par pièce ———
  ...roomTasks('Chambre parents', P.s2, [
    'Trier armoire et commode',
    'Cartonner vêtements été',
    'Cartonner vêtements hors saison',
    'Cartonner chaussures et accessoires',
    'Emballer objets fragiles et déco',
    'Démonter tête de lit si nécessaire',
    'Préparer sac nuit / 2 jours',
  ]),
  ...roomTasks('Chambre Julie', P.s2, [
    'Trier jouets (don / vente / garder)',
    'Cartonner livres et jeux',
    'Cartonner vêtements',
    'Préparer valise vacances Julie',
    'Cartonner déco et affiches',
    'Protéger bureau / étagères',
  ]),
  ...roomTasks('Chambre Elie', P.s2, [
    'Trier jouets et livres',
    'Cartonner vêtements',
    'Cartonner déco',
    'Préparer sac affaires essentielles',
    'Démonter lit si nécessaire',
  ]),
  ...roomTasks('Chambre Raph', P.s2, [
    'Trier jouets et livres',
    'Cartonner vêtements',
    'Cartonner déco',
    'Préparer sac affaires essentielles',
    'Démonter lit si nécessaire',
  ]),
  ...roomTasks('Salon-cuisine', P.s2, [
    'Cartonner vaisselle non quotidienne',
    'Cartonner livres et jeux famille',
    'Cartonner déco salon',
    'Trier placards cuisine (épices, conserves)',
    'Cartonner électroménager petit format',
    'Démonter étagères / cadres muraux',
    'Préparer carton vaisselle jour J',
  ], 'haute'),
  ...roomTasks('Salle de bain', P.s2, [
    'Cartonner serviettes et linge',
    'Cartonner produits (bien fermer)',
    'Trier pharmacie / médicaments',
    'Emballer miroir et accessoires',
  ]),
  ...roomTasks('Buanderie', P.s2, [
    'Cartonner produits ménagers',
    'Préparer machine à laver (vider + caler tambour)',
    'Cartonner balai, serpillière, aspirateur',
    'Trier produits entretien ouverts',
  ]),
  ...roomTasks('Dressing', P.s2, [
    'Finir tri vêtements famille',
    'Cartonner chaussures',
    'Cartonner sacs et accessoires',
    'Étiqueter cartons par personne',
  ]),
  ...roomTasks('Garage', P.s2, [
    'Cartonner outils',
    'Cartonner sport / EPS',
    'Trier vélos (démontage roues ?)',
    'Cartonner jardinage',
    'Vider étagères garage',
  ]),
  ...roomTasks('Cave', P.s2, [
    'Cartonner bouteilles (transport sécurisé)',
    'Cartonner rangements cave',
    'Vider étagères cave',
  ], 'haute'),
  ...roomTasks('Abri de jardin', P.s2, [
    'Ranger tondeuse / outils jardin',
    'Cartonner mobilier jardin fragile',
    'Vider abri avant départ',
  ]),
  echeancier('Organiser don / déchetterie / Leboncoin', { category: 'Cartons', period: P.s2 }),
  echeancier('Étiqueter tous les cartons (pièce + priorité)', { category: 'Cartons', priority: 'haute', period: P.s2 }),

  // ——— 25-28 juillet : dernière ligne droite ———
  echeancier('Préparer documents état des lieux', { category: 'Logement', priority: 'haute', period: P.s3 }),
  echeancier('Préparer voiture 1 (documents / valeurs)', { category: 'Voitures', priority: 'haute', period: P.s3 }),
  echeancier('Préparer voiture 2 (première nuit)', { category: 'Voitures', priority: 'haute', period: P.s3 }),
  echeancier('Confirmer heure d\'arrivée déménageur', { category: 'Déménageur', priority: 'haute', period: P.s3 }),
  echeancier('Vider frigo et congélateur', { category: 'Salon-cuisine', priority: 'haute', period: P.s3 }),
  echeancier('Préparer eau / repas / café pour le 29', { category: 'Voitures', period: P.s3 }),
  echeancier('Finir cartons P1 restants', { category: 'Cartons', priority: 'haute', period: P.s3 }),
  echeancier('Nettoyage maison (premier passage)', { category: 'Nettoyage', period: P.s3 }),
  echeancier('Couper eau / gaz si consignes notaire', { category: 'Logement', period: P.s3 }),
  echeancier('Préparer trousse outils démontage', { category: 'Garage', period: P.s3 }),
  echeancier('Vérifier clés, badges, télécommandes', { category: 'Logement', priority: 'haute', period: P.s3 }),
  echeancier('Charger voiture 1 en priorité', { category: 'Voitures', period: P.s3 }),
  echeancier('Préparer plan de chargement camion', { category: 'Déménageur', period: P.s3 }),

  // ——— 29 juillet ———
  echeancier('Déménagement maison → appartement', { category: 'Logement', priority: 'haute', period: P.j29, due_date: '2026-07-29' }),
  echeancier('Accueillir déménageur et superviser chargement', { category: 'Déménageur', priority: 'haute', period: P.j29, due_date: '2026-07-29' }),
  echeancier('Relever compteurs maison', { category: 'Énergie', priority: 'haute', period: P.j29, due_date: '2026-07-29' }),
  echeancier('Photos maison avant départ', { category: 'Vente', period: P.j29, due_date: '2026-07-29' }),
  echeancier('Dernier tour toutes pièces', { category: 'Cartons', priority: 'haute', period: P.j29, due_date: '2026-07-29' }),
  echeancier('Fermer cave, abri, garage, volets', { category: 'Logement', priority: 'haute', period: P.j29, due_date: '2026-07-29' }),

  // ——— 30 juillet ———
  echeancier('État des lieux appartement', { category: 'Logement', priority: 'haute', period: P.j30, due_date: '2026-07-30' }),
  echeancier('Relever compteurs appartement', { category: 'Énergie', priority: 'haute', period: P.j30, due_date: '2026-07-30' }),
  echeancier('Photos état des lieux (pièce par pièce)', { category: 'Logement', priority: 'haute', period: P.j30, due_date: '2026-07-30' }),
  echeancier('Installer lits en priorité', { category: 'Logement', priority: 'haute', period: P.j30, due_date: '2026-07-30' }),
  echeancier('Ouvrir cartons P1 (cuisine, SDB, draps)', { category: 'Cartons', priority: 'haute', period: P.j30, due_date: '2026-07-30' }),
  echeancier('Vérifier eau chaude, électricité, internet', { category: 'Logement', period: P.j30, due_date: '2026-07-30' }),
  echeancier('Mettre noms sur boîte aux lettres', { category: 'Logement', period: P.j30, due_date: '2026-07-30' }),

  // ——— Après emménagement ———
  echeancier('Déballer cartons P2', { category: 'Cartons', period: P.apres }),
  echeancier('Ranger chambres enfants', { category: 'Enfants', period: P.apres }),
  echeancier('Installer rideaux / étagères', { category: 'Logement', period: P.apres }),
  echeancier('Nettoyage fin maison vendue', { category: 'Nettoyage', period: P.apres }),
  echeancier('Remise clés acheteur / agence', { category: 'Vente', period: P.apres }),
  echeancier('Suivi vente définitive chez le notaire', { category: 'Vente', period: P.apres }),
  echeancier('Mettre à jour adresse restante (sites oubliés)', { category: 'Administratif', period: P.apres }),
  echeancier('Ranger cave appartement / stockage bouteilles', { category: 'Cave', period: P.apres }),

  // ——— Vérifications anti-oubli (28-30 juillet) ———
  echeancier('✓ Cartons P1 identifiés et étiquetés', { category: 'Vérification', priority: 'haute', period: P.s3, due_date: '2026-07-28' }),
  echeancier('✓ Documents dans voiture 1', { category: 'Vérification', priority: 'haute', period: P.s3, due_date: '2026-07-28' }),
  echeancier('✓ Médicaments hors cartons', { category: 'Vérification', period: P.s3, due_date: '2026-07-28' }),
  echeancier('✓ Chargeurs hors cartons', { category: 'Vérification', period: P.s3, due_date: '2026-07-28' }),
  echeancier('✓ Draps / oreillers prêts voiture 2', { category: 'Vérification', period: P.s3, due_date: '2026-07-28' }),
  echeancier('✓ Frigo et congélateur vidés', { category: 'Vérification', priority: 'haute', period: P.s3, due_date: '2026-07-28' }),
  echeancier('✓ Heure déménageur confirmée', { category: 'Vérification', priority: 'haute', period: P.s3, due_date: '2026-07-28' }),
  echeancier('✓ Dernier tour garage, cave, abri', { category: 'Vérification', priority: 'haute', period: P.j29, due_date: '2026-07-29' }),
  echeancier('✓ Dernier tour chambres enfants', { category: 'Vérification', period: P.j29, due_date: '2026-07-29' }),
  echeancier('✓ Voitures 1 et 2 chargées', { category: 'Vérification', priority: 'haute', period: P.j29, due_date: '2026-07-29' }),
  echeancier('✓ Maison fermée, volets, poubelles', { category: 'Vérification', priority: 'haute', period: P.j29, due_date: '2026-07-29' }),
  echeancier('✓ Bail et assurance à l\'état des lieux', { category: 'Vérification', priority: 'haute', period: P.j30, due_date: '2026-07-30' }),
  echeancier('✓ Photos état des lieux complètes', { category: 'Vérification', priority: 'haute', period: P.j30, due_date: '2026-07-30' }),
  echeancier('✓ Compteurs relevés appartement', { category: 'Vérification', priority: 'haute', period: P.j30, due_date: '2026-07-30' }),
  echeancier('✓ Clés et badges récupérés', { category: 'Vérification', priority: 'haute', period: P.j30, due_date: '2026-07-30' }),
]
