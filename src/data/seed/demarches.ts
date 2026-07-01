import { demarche } from './helpers'

export const DEMARCHES_SEED = [
  // Adresse
  demarche('Programmer la réexpédition courrier (La Poste)', 'La Poste', { category: 'Adresse', priority: 'haute' }),
  demarche('Changement d\'adresse sur Service-public.fr', 'Service-public', { category: 'Adresse', priority: 'haute' }),
  demarche('Prévenir les impôts (adresse fiscale)', 'Impôts', { category: 'Adresse' }),
  demarche('Mettre à jour adresse CAF', 'CAF', { category: 'Adresse' }),
  demarche('Prévenir mairie (domicile / école)', 'Mairie', { category: 'Adresse' }),
  demarche('Mettre à jour adresse carte d\'identité / passeport si besoin', 'Mairie', { category: 'Adresse' }),

  // Santé
  demarche('Modifier adresse CPAM / Ameli', 'Ameli', { category: 'Santé', priority: 'haute' }),
  demarche('Modifier adresse mutuelle', 'Mutuelle', { category: 'Santé' }),
  demarche('Prévenir médecin traitant', 'Médecin', { category: 'Santé' }),
  demarche('Prévenir pédiatre / médecin enfants', 'Pédiatre', { category: 'Santé' }),
  demarche('Transférer dossiers médicaux (ordonnances, vaccins)', 'Médecin', { category: 'Santé' }),
  demarche('Prévenir dentiste', 'Dentiste', { category: 'Santé' }),
  demarche('Prévenir ophtalmologue', 'Ophtalmo', { category: 'Santé' }),
  demarche('Mettre à jour pharmacie habituelle', 'Pharmacie', { category: 'Santé' }),

  // Banque
  demarche('Prévenir banque (adresse + RIB inchangé)', 'Banque', { category: 'Banque', priority: 'haute' }),
  demarche('Mettre à jour adresse carte bancaire', 'Banque', { category: 'Banque' }),
  demarche('Prévenir assurance vie / épargne', 'Assureur', { category: 'Banque' }),
  demarche('Prévenir crédit immobilier si concerné', 'Banque', { category: 'Banque' }),

  // Assurance
  demarche('Souscrire assurance habitation appartement', 'Assurance', { category: 'Assurance', priority: 'haute' }),
  demarche('Maintenir assurance maison jusqu\'à vente', 'Assurance', { category: 'Assurance', priority: 'haute' }),
  demarche('Modifier assurance auto (adresse)', 'Assurance auto', { category: 'Assurance' }),
  demarche('Assurance scolaire Julie', 'Assurance', { category: 'École' }),
  demarche('Assurance scolaire Elie', 'Assurance', { category: 'École' }),
  demarche('Assurance scolaire Raph', 'Assurance', { category: 'École' }),
  demarche('Vérifier garantie déménagement (vol / casse)', 'Assurance', { category: 'Assurance' }),

  // École & enfants
  demarche('Inscription école Julie à Lorgues', 'École', { category: 'École', priority: 'haute' }),
  demarche('Inscription école Elie à Lorgues', 'École', { category: 'École', priority: 'haute' }),
  demarche('Inscription école Raph à Lorgues', 'École', { category: 'École', priority: 'haute' }),
  demarche('Inscription périscolaire / garderie', 'Mairie', { category: 'École' }),
  demarche('Inscription cantine scolaire', 'Mairie', { category: 'École' }),
  demarche('Certificat de radiation ancienne école', 'École', { category: 'École' }),
  demarche('Transférer dossier scolaire (bulletins, PAI)', 'École', { category: 'École' }),
  demarche('Résilier activités extrascolaires ancienne ville', 'Clubs', { category: 'Sport' }),
  demarche('Inscrire activités sport / loisirs Lorgues', 'Clubs', { category: 'Sport' }),

  // Énergie & eau
  demarche('Ouvrir contrat électricité appartement (ENGIE)', 'ENGIE', { category: 'Énergie', priority: 'haute' }),
  demarche('Résilier électricité maison', 'Fournisseur actuel', { category: 'Énergie' }),
  demarche('Relever compteur électricité maison', 'Fournisseur actuel', { category: 'Énergie' }),
  demarche('Relever compteur électricité appartement', 'ENGIE', { category: 'Énergie', priority: 'haute' }),
  demarche('Ouvrir contrat eau appartement', 'Eau', { category: 'Eau', priority: 'haute' }),
  demarche('Résilier eau maison', 'Eau', { category: 'Eau' }),
  demarche('Relever compteur eau maison', 'Eau', { category: 'Eau' }),
  demarche('Relever compteur eau appartement', 'Eau', { category: 'Eau', priority: 'haute' }),
  demarche('Gaz : résiliation maison / ouverture appartement si concerné', 'Gaz', { category: 'Énergie' }),

  // Internet & télécom
  demarche('Transfert ou souscription internet appartement', 'Opérateur', { category: 'Internet', priority: 'haute' }),
  demarche('Résilier internet maison', 'Opérateur', { category: 'Internet' }),
  demarche('Mettre à jour adresse forfaits mobiles', 'Opérateur', { category: 'Télécom' }),
  demarche('Mettre à jour adresse box / ligne fixe', 'Opérateur', { category: 'Télécom' }),

  // Vente maison
  demarche('Suivi compromis / acte chez le notaire', 'Notaire', { category: 'Vente', priority: 'haute' }),
  demarche('Fournir diagnostics obligatoires vente', 'Notaire', { category: 'Vente' }),
  demarche('Planifier nettoyage / débarras avant remise clés', 'Agence', { category: 'Vente' }),
  demarche('Remise clés acheteur', 'Notaire', { category: 'Vente' }),

  // Véhicules
  demarche('Changer adresse carte grise (ANTS)', 'ANTS', { category: 'Véhicules' }),
  demarche('Mettre à jour contrôle technique si expiration proche', 'Garage', { category: 'Véhicules' }),

  // Employeur
  demarche('Prévenir employeur(s) du déménagement', 'Employeur', { category: 'Employeur' }),
  demarche('Demander attestation employeur si utile (école / bail)', 'Employeur', { category: 'Employeur' }),
  demarche('Prévenir retraite / caisse si concerné', 'Retraite', { category: 'Retraite' }),

  // Logement appartement
  demarche('Verser dépôt de garantie / premier loyer', 'Bailleur', { category: 'Logement', priority: 'haute' }),
  demarche('Souscrire assurance habitation (attestation bailleur)', 'Assurance', { category: 'Logement', priority: 'haute' }),
  demarche('Contacter syndic / gardien copropriété', 'Syndic', { category: 'Logement' }),
  demarche('Réserver ascenseur / monte-charge si immeuble', 'Syndic', { category: 'Logement' }),

  // Abonnements
  demarche('Mettre à jour adresse Amazon', 'Amazon', { category: 'Abonnements' }),
  demarche('Mettre à jour adresse Vinted / Leboncoin', 'Vinted', { category: 'Abonnements' }),
  demarche('Mettre à jour Netflix / Disney+ / Prime', 'Streaming', { category: 'Abonnements' }),
  demarche('Mettre à jour Spotify / Apple / abonnements numériques', 'Streaming', { category: 'Abonnements' }),
  demarche('Mettre à jour abonnements presse / box', 'Presse', { category: 'Abonnements' }),
  demarche('Mettre à jour assurance habitation ancienne adresse sur sites', 'Divers', { category: 'Abonnements' }),
  demarche('Résilier alarme / télésurveillance maison', 'Alarme', { category: 'Abonnements' }),

  // Impôts & taxes
  demarche('Taxe d\'habitation / foncière : signaler changement', 'Impôts', { category: 'Impôts' }),
  demarche('Taxe ordures ménagères (changement commune)', 'Mairie', { category: 'Impôts' }),
]
