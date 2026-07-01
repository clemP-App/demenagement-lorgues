import { ModulePage } from '@/components/ModulePage'
import { DEMARCHES_CATEGORIES, PIECES_ACTUELLES } from '@/lib/constants'
import type { Item } from '@/types'

const quickFilters = [
  { key: 'demarches', label: 'Démarches', value: 'module:demarches' },
  { key: 'cartons', label: 'Cartons', value: 'module:cartons' },
  ...DEMARCHES_CATEGORIES.slice(0, 6).map((c) => ({ key: `d-${c}`, label: c, value: c })),
  ...PIECES_ACTUELLES.map((p) => ({ key: `p-${p}`, label: p, value: `piece:${p}` })),
]

function prepFilter(items: Item[], filter: string): Item[] {
  if (filter === 'module:demarches') return items.filter((i) => i.module === 'demarches')
  if (filter === 'module:cartons') return items.filter((i) => i.module === 'cartons')
  if (filter.startsWith('piece:')) {
    return items.filter((i) => i.data.piece_actuelle === filter.replace('piece:', ''))
  }
  if (filter.startsWith('priority:')) {
    return items.filter((i) => i.priority === filter.replace('priority:', ''))
  }
  return items.filter((i) => i.category === filter)
}

function groupByType(items: Item[]) {
  const demarches = items.filter((i) => i.module === 'demarches')
  const cartons = items.filter((i) => i.module === 'cartons')
  return [
    { label: 'Démarches administratives', items: demarches },
    { label: 'Cartons et meubles', items: cartons },
  ].filter((g) => g.items.length > 0)
}

function groupDemarchesByCategory(items: Item[]) {
  return DEMARCHES_CATEGORIES.map((cat) => ({
    label: cat,
    items: items.filter((i) => i.module === 'demarches' && i.category === cat),
  })).filter((g) => g.items.length > 0)
}

function groupCartonsByPiece(items: Item[]) {
  return PIECES_ACTUELLES.map((piece) => ({
    label: piece,
    items: items.filter((i) => i.module === 'cartons' && i.data.piece_actuelle === piece),
  })).filter((g) => g.items.length > 0)
}

export function PreparationPage() {
  return (
    <ModulePage
      modules={['demarches', 'cartons']}
      title="Préparation"
      subtitle="Démarches admin et cartons — filtrez par type ou pièce"
      quickFilters={quickFilters}
      filterFn={prepFilter}
      groupBy={groupByType}
      groupByCategory={(items) => {
        const dem = items.filter((i) => i.module === 'demarches')
        const cart = items.filter((i) => i.module === 'cartons')
        if (dem.length >= cart.length) return groupDemarchesByCategory(items)
        return groupCartonsByPiece(items)
      }}
      defaultStatus="a_faire"
    showModuleOnCard
  />
)
}