import type { ItemInput } from '@/types'

export type SeedItem = Omit<ItemInput, 'module'> & { module: ItemInput['module'] }

export function echeancier(title: string, opts: Partial<SeedItem> = {}): SeedItem {
  return { module: 'echeancier', title, status: 'a_faire', priority: 'moyenne', ...opts }
}

export function demarche(title: string, organisme: string, opts: Partial<SeedItem> = {}): SeedItem {
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

export function carton(title: string, opts: Partial<SeedItem> = {}): SeedItem {
  return {
    module: 'cartons',
    title,
    status: 'a_faire',
    priority: 'p2',
    data: { fragile: false, a_demonter: false, transport: 'Camion', ...opts.data },
    ...opts,
  }
}

export function cartonPiece(
  piece: string,
  arrivee: string,
  contenu: string,
  opts: Partial<SeedItem> = {},
): SeedItem {
  const label = contenu.length > 40 ? contenu.slice(0, 37) + '…' : contenu
  return carton(`Carton ${piece} — ${label}`, {
    data: { piece_actuelle: piece, piece_arrivee: arrivee, contenu, ...opts.data },
    ...opts,
  })
}

export function voiture(title: string, voitureName: string, opts: Partial<SeedItem> = {}): SeedItem {
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

export function document(title: string, opts: Partial<SeedItem> = {}): SeedItem {
  return {
    module: 'documents',
    title,
    status: 'a_recuperer',
    priority: 'haute',
    data: { version_papier: false, version_numerique: false, ...opts.data },
    ...opts,
  }
}

export function contact(title: string, opts: Partial<SeedItem> = {}): SeedItem {
  return {
    module: 'contacts',
    title,
    status: 'a_contacter',
    priority: 'moyenne',
    data: { personne: '', telephone: '', email: '', role: '', ...opts.data },
    ...opts,
  }
}

export function verification(title: string, jour: string, opts: Partial<SeedItem> = {}): SeedItem {
  return {
    module: 'verifications',
    title,
    status: 'a_verifier',
    priority: 'haute',
    data: { jour, moment: 'Matin', lieu: 'Maison', ...opts.data },
    ...opts,
  }
}

export function budget(title: string, montant: number, opts: Partial<SeedItem> = {}): SeedItem {
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

/** Clé unique pour éviter les doublons lors du rechargement du modèle */
export function seedKey(item: SeedItem): string {
  return `${item.module}::${item.title}`
}
