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
  demarches: '/preparation',
  cartons: '/preparation',
  voitures: '/voitures',
  documents: '/documents',
  contacts: '/parametres',
  verifications: '/echeancier',
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
  'Logement', 'Administratif', 'Cartons', 'École', 'Énergie', 'Eau',
  'Vente', 'Voitures', 'Notaire', 'Internet', 'Assurance', 'Nettoyage',
  'Chambre parents', 'Chambre Julie', 'Chambre Elie', 'Chambre Raph',
  'Salle de bain', 'Buanderie', 'Garage', 'Cave', 'Abri de jardin', 'Dressing',
  'Salon-cuisine', 'Déménageur', 'Enfants', 'Vérification',
] as const

export const DEMARCHES_CATEGORIES = [
  'Adresse', 'Santé', 'Banque', 'Assurance', 'École', 'Énergie', 'Eau',
  'Internet', 'Vente', 'Véhicules', 'Employeur', 'Abonnements', 'Impôts',
  'Retraite', 'Télécom', 'Logement', 'Enfants', 'Sport', 'Animaux',
] as const

export const PIECES_ACTUELLES = [
  'Salon-cuisine',
  'Chambre parents',
  'Chambre Julie',
  'Chambre Elie',
  'Chambre Raph',
  'Salle de bain',
  'Buanderie',
  'Dressing couloir',
  'Garage',
  'Cave',
  'Abri de jardin',
] as const

export const PIECES_ARRIVEE = [
  'Salon',
  'Cuisine',
  'Chambre parents',
  'Chambre Julie',
  'Chambre Elie',
  'Chambre Raph',
  'Salle de bain',
  'Buanderie',
  'Dressing couloir',
  'Garage',
  'Cave / stockage',
  'Balcon / extérieur',
  'À décider',
] as const

export const VOITURES = ['Voiture 1', 'Voiture 2'] as const

export const VOITURE_CATEGORIES = [
  'Documents', 'Valeurs', 'Première nuit', 'Nourriture', 'Hygiène',
  'Outils', 'Julie', 'Enfants', 'Électronique', 'Santé',
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
  'Maison', 'Appartement', 'Voiture 1', 'Voiture 2', 'Camion',
  'Garage', 'Dressing couloir', 'Cave', 'Abri de jardin',
  'Chambre parents', 'Chambre Julie', 'Chambre Elie', 'Chambre Raph',
  'Salon-cuisine', 'Buanderie',
] as const

/** Date représentative d'une période (pour le calendrier) */
export const PERIOD_ANCHOR_DATE: Record<string, string> = {
  'Avant 11 juillet': '2026-07-10',
  '11-17 juillet': '2026-07-14',
  '18-24 juillet': '2026-07-21',
  '25-28 juillet': '2026-07-27',
  '29 juillet': '2026-07-29',
  '30 juillet': '2026-07-30',
  'Après emménagement': '2026-08-05',
}

export const PERIOD_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  'Avant 11 juillet': { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', dot: 'bg-violet-500' },
  '11-17 juillet': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
  '18-24 juillet': { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', dot: 'bg-cyan-500' },
  '25-28 juillet': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
  '29 juillet': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500' },
  '30 juillet': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500' },
  'Après emménagement': { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', dot: 'bg-slate-400' },
}

export const CATEGORY_ACCENT: Record<string, string> = {
  Logement: 'from-blue-500 to-indigo-500',
  Administratif: 'from-slate-500 to-slate-600',
  Cartons: 'from-amber-500 to-orange-500',
  École: 'from-purple-500 to-violet-500',
  Énergie: 'from-yellow-500 to-amber-500',
  Vente: 'from-emerald-500 to-teal-500',
  Voitures: 'from-green-500 to-emerald-500',
  Assurance: 'from-rose-500 to-pink-500',
  'Chambre parents': 'from-indigo-400 to-blue-500',
  'Chambre Julie': 'from-pink-400 to-rose-500',
  'Chambre Elie': 'from-sky-400 to-blue-500',
  'Chambre Raph': 'from-lime-400 to-green-500',
  'Salon-cuisine': 'from-orange-400 to-amber-500',
  Garage: 'from-stone-500 to-zinc-600',
  Cave: 'from-red-400 to-rose-600',
  'Abri de jardin': 'from-green-400 to-emerald-600',
  'Dressing': 'from-fuchsia-400 to-purple-500',
  'Dressing couloir': 'from-fuchsia-400 to-purple-500',
  'Salle de bain': 'from-cyan-400 to-teal-500',
  Buanderie: 'from-teal-400 to-cyan-500',
  Déménageur: 'from-brand-500 to-blue-600',
  Nettoyage: 'from-slate-400 to-gray-500',
  Enfants: 'from-violet-400 to-purple-500',
}

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
