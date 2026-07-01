import type { ItemInput } from '@/types'
import type { SeedItem } from './helpers'
import { seedKey } from './helpers'
import { ECHEANCIER_SEED } from './echeancier'
import { DEMARCHES_SEED } from './demarches'
import { CARTONS_SEED } from './cartons'
import { VOITURES_SEED, DOCUMENTS_SEED, CONTACTS_SEED, VERIFICATIONS_SEED, BUDGET_SEED } from './rest'

export const SEED_ITEMS: SeedItem[] = [
  ...ECHEANCIER_SEED,
  ...DEMARCHES_SEED,
  ...CARTONS_SEED,
  ...VOITURES_SEED,
  ...DOCUMENTS_SEED,
  ...CONTACTS_SEED,
  ...VERIFICATIONS_SEED,
  ...BUDGET_SEED,
]

/** Éléments du modèle absents du workspace (évite les doublons au rechargement) */
export function getMissingSeedItems(existing: ItemInput[]): SeedItem[] {
  const keys = new Set(existing.map((i) => `${i.module}::${i.title}`))
  return SEED_ITEMS.filter((s) => !keys.has(seedKey(s)))
}

export { seedKey } from './helpers'
