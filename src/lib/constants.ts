import type { ModuleType } from '@/types'

export const MODULE_LABELS: Record<ModuleType, string> = {
  echeancier: 'Échéancier',
  demarches: 'Démarches',
  cartons: 'Cartons',
  voitures: 'Voitures',
  documents: 'Documents',
  contacts: 'Contacts',
  verifications: 'Vérifications',
  budget: 'Budget',
}

export const MODULE_PATHS: Record<ModuleType, string> = {
  echeancier: '/echeancier',
  demarches: '/demarches',
  cartons: '/cartons',
  voitures: '/voitures',
  documents: '/documents',
  contacts: '/contacts',
  verifications: '/verifications',
  budget: '/budget',
}

export const STATUS_LABELS: Record<string, string> = {
  a_faire: 'À faire',
  en_cours: 'En cours',
  fait: 'Fait',
  bloque: 'Bloqué',
  a_verifier: 'À vérifier',
  ferme: 'Fermé',
  charge: 'Chargé',
  depose: 'Déposé',
  ouvert: 'Ouvert',
  a_preparer: 'À préparer',
  pret: 'Prêt',
  dans_voiture: 'Dans la voiture',
  a_recuperer: 'À récupérer',
  recu: 'Reçu',
  imprime: 'Imprimé',
  envoye: 'Envoyé',
  a_contacter: 'À contacter',
  contacte: 'Contacté',
  en_attente: 'En attente',
  ok: 'OK',
  probleme: 'Problème',
}

export const PRIORITY_LABELS: Record<string, string> = {
  haute: 'Haute',
  moyenne: 'Moyenne',
  basse: 'Basse',
  indispensable: 'Indispensable',
  important: 'Important',
  confort: 'Confort',
  p1: 'P1 urgent',
  p2: 'P2 semaine 1',
  p3: 'P3 plus tard',
}

export const PERIODS = [
  'Avant 11 juillet',
  '11-17 juillet',
  '18-24 juillet',
  '25-28 juillet',
  '29 juillet',
  '30 juillet',
  'Après emménagement',
] as const

export const ECHEANCIER_CATEGORIES = [
  'Logement', 'Administratif', 'Cartons', 'École', 'Énergie',
  'Vente', 'Voitures', 'Notaire', 'Internet', 'Assurance',
] as const

export const DEMARCHES_CATEGORIES = [
  'Adresse', 'Santé', 'Banque', 'Assurance', 'École', 'Énergie',
  'Internet', 'Vente', 'Véhicules', 'Employeur', 'Abonnements',
] as const

export const PIECES_ACTUELLES = [
  'Chambre parents', 'Chambre Julie', 'Chambre 3', 'Chambre 4',
  'Salle de bain', 'Buanderie', 'Salon-cuisine', 'Garage', 'Dressing',
] as const

export const PIECES_ARRIVEE = [
  'Chambre parents', 'Chambre Julie', 'Salon', 'Cuisine', 'Salle de bain',
  'Buanderie', 'Garage', 'Dressing', 'Cave / stockage', 'À décider',
] as const

export const VOITURES = ['Voiture 1', 'Voiture 2'] as const

export const VOITURE_CATEGORIES = [
  'Documents', 'Valeurs', 'Première nuit', 'Nourriture', 'Hygiène',
  'Outils', 'Julie', 'Électronique', 'Santé',
] as const

export const DOCUMENT_CATEGORIES = [
  'Appartement', 'Maison', 'Vente', 'École', 'Déménageur',
  'Assurance', 'Énergie', 'Santé', 'Identité',
] as const

export const CONTACT_CATEGORIES = [
  'Déménageur', 'Agence', 'Propriétaire', 'Notaire', 'École',
  'Mairie', 'Assurance', 'Énergie', 'Internet', 'Banque',
] as const

export const BUDGET_CATEGORIES = [
  'Déménageur', 'Logement', 'Transport', 'Administratif',
  'Équipement', 'Nettoyage', 'Repas', 'École',
] as const

export const VERIFICATION_JOURS = ['28 juillet', '29 juillet', '30 juillet'] as const
export const VERIFICATION_MOMENTS = ['Matin', 'Midi', 'Après-midi', 'Soir'] as const
export const VERIFICATION_LIEUX = [
  'Maison', 'Appartement', 'Voiture 1', 'Voiture 2', 'Camion', 'Garage', 'Dressing',
] as const

export const DONE_STATUSES = new Set([
  'fait', 'ferme', 'charge', 'depose', 'ouvert', 'pret', 'dans_voiture',
  'recu', 'imprime', 'envoye', 'ok', 'contacte',
])

export const URGENT_PRIORITIES = new Set(['haute', 'indispensable', 'p1', 'important'])

export const STATUS_COLORS: Record<string, string> = {
  a_faire: 'bg-slate-100 text-slate-700',
  en_cours: 'bg-blue-100 text-blue-700',
  fait: 'bg-green-100 text-green-700',
  bloque: 'bg-red-100 text-red-700',
  a_verifier: 'bg-orange-100 text-orange-700',
  ferme: 'bg-green-100 text-green-700',
  charge: 'bg-blue-100 text-blue-700',
  depose: 'bg-green-100 text-green-700',
  ouvert: 'bg-green-100 text-green-700',
  a_preparer: 'bg-slate-100 text-slate-700',
  pret: 'bg-blue-100 text-blue-700',
  dans_voiture: 'bg-green-100 text-green-700',
  a_recuperer: 'bg-orange-100 text-orange-700',
  recu: 'bg-green-100 text-green-700',
  imprime: 'bg-green-100 text-green-700',
  envoye: 'bg-green-100 text-green-700',
  a_contacter: 'bg-orange-100 text-orange-700',
  contacte: 'bg-blue-100 text-blue-700',
  en_attente: 'bg-orange-100 text-orange-700',
  ok: 'bg-green-100 text-green-700',
  probleme: 'bg-red-100 text-red-700',
}

export const PRIORITY_COLORS: Record<string, string> = {
  haute: 'bg-red-100 text-red-700',
  moyenne: 'bg-amber-100 text-amber-700',
  basse: 'bg-slate-100 text-slate-600',
  indispensable: 'bg-red-100 text-red-700',
  important: 'bg-orange-100 text-orange-700',
  confort: 'bg-slate-100 text-slate-600',
  p1: 'bg-red-100 text-red-700',
  p2: 'bg-amber-100 text-amber-700',
  p3: 'bg-slate-100 text-slate-600',
}

export const MODULE_DONE_STATUS: Partial<Record<ModuleType, string[]>> = {
  echeancier: ['fait'],
  demarches: ['fait'],
  cartons: ['ferme', 'charge', 'depose', 'ouvert'],
  voitures: ['dans_voiture'],
  documents: ['recu', 'imprime', 'envoye'],
  contacts: ['ok', 'contacte'],
  verifications: ['ok'],
  budget: ['fait'],
}

export function getDefaultStatuses(module: ModuleType): string[] {
  switch (module) {
    case 'cartons': return ['a_faire', 'en_cours', 'ferme', 'charge', 'depose', 'ouvert']
    case 'voitures': return ['a_preparer', 'pret', 'dans_voiture']
    case 'documents': return ['a_recuperer', 'recu', 'imprime', 'envoye', 'a_verifier']
    case 'contacts': return ['a_contacter', 'contacte', 'en_attente', 'ok']
    case 'verifications': return ['a_verifier', 'ok', 'probleme']
    case 'budget': return ['a_faire', 'en_cours', 'fait']
    default: return ['a_faire', 'en_cours', 'fait', 'bloque', 'a_verifier']
  }
}

export function getDefaultPriorities(module: ModuleType): string[] {
  switch (module) {
    case 'cartons': return ['p1', 'p2', 'p3']
    case 'voitures': return ['indispensable', 'important', 'confort']
    case 'budget': return ['haute', 'moyenne', 'basse']
    default: return ['haute', 'moyenne', 'basse']
  }
}
