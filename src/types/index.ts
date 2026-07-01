export type ModuleType =
  | 'echeancier'
  | 'demarches'
  | 'cartons'
  | 'voitures'
  | 'documents'
  | 'contacts'
  | 'verifications'
  | 'budget'

export type Status =
  | 'a_faire'
  | 'en_cours'
  | 'fait'
  | 'bloque'
  | 'a_verifier'
  | 'ferme'
  | 'charge'
  | 'depose'
  | 'ouvert'
  | 'a_preparer'
  | 'pret'
  | 'dans_voiture'
  | 'a_recuperer'
  | 'recu'
  | 'imprime'
  | 'envoye'
  | 'a_contacter'
  | 'contacte'
  | 'en_attente'
  | 'ok'
  | 'probleme'

export type Priority = 'haute' | 'moyenne' | 'basse' | 'indispensable' | 'important' | 'confort' | 'p1' | 'p2' | 'p3'

export interface Workspace {
  id: string
  name: string
  invite_code: string
  seed_version: number
  created_at: string
  updated_at: string
  display_name?: string
  role?: string
}

export interface WorkspaceMember {
  id: string
  workspace_id: string
  user_id: string
  display_name: string
  role: string
  created_at: string
}

export interface ItemData {
  // Cartons
  piece_actuelle?: string
  piece_arrivee?: string
  fragile?: boolean
  transport?: string
  contenu?: string
  a_demonter?: boolean
  // Voitures
  voiture?: string
  sac_caisse?: string
  indispensable?: boolean
  // Documents
  version_papier?: boolean
  version_numerique?: boolean
  emplacement?: string
  // Contacts
  telephone?: string
  email?: string
  role?: string
  personne?: string
  organisme?: string
  lien?: string
  identifiants?: string
  preuve_conservee?: boolean
  a_contacter_avant?: string
  // Budget
  montant_estime?: number
  montant_reel?: number
  paye?: boolean
  justificatif_conserve?: boolean
  moyen_paiement?: string
  date_depense?: string
  // Vérifications
  jour?: string
  moment?: string
  lieu?: string
}

export interface Item {
  id: string
  workspace_id: string
  module: ModuleType
  title: string
  status: string
  priority: string
  category: string | null
  period: string | null
  due_date: string | null
  responsible: string | null
  notes: string | null
  data: ItemData
  sort_order: number
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  workspace_id: string
  item_id: string
  author_id: string | null
  author_name: string
  content: string
  created_at: string
}

export interface ActivityLog {
  id: string
  workspace_id: string
  item_id: string | null
  action: string
  old_value: Record<string, unknown> | null
  new_value: Record<string, unknown> | null
  author_id: string | null
  author_name: string
  created_at: string
}

export interface ItemInput {
  module: ModuleType
  title: string
  status?: string
  priority?: string
  category?: string | null
  period?: string | null
  due_date?: string | null
  responsible?: string | null
  notes?: string | null
  data?: ItemData
  sort_order?: number
}

export interface FilterState {
  search: string
  status: string
  priority: string
  category: string
  responsible: string
  period: string
  module: string
}

export interface ModuleStats {
  total: number
  done: number
  urgent: number
  blocked: number
  percent: number
}

export const MOVE_DATE = new Date('2026-07-29')
export const INSPECTION_DATE = new Date('2026-07-30')
export const LAST_STRETCH_DATE = new Date('2026-07-25')
export const CURRENT_SEED_VERSION = 3
