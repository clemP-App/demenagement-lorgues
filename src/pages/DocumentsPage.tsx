import { ModulePage } from '@/components/ModulePage'
import { DOCUMENT_CATEGORIES } from '@/lib/constants'
import type { Item } from '@/types'

const quickFilters = [
  { key: 'recuperer', label: 'À récupérer', value: 'status:a_recuperer' },
  { key: 'imprimer', label: 'À imprimer', value: 'status:imprime' },
  { key: 'voiture1', label: 'Pour voiture 1', value: 'voiture1' },
  ...DOCUMENT_CATEGORIES.map((c) => ({ key: c, label: c, value: c })),
]

function docFilter(items: Item[], filter: string): Item[] {
  if (filter === 'voiture1') {
    return items.filter((i) =>
      ['Bail appartement', 'Attestation assurance habitation appartement', 'Compromis de vente',
        'Documents notaire', 'Livret de famille', 'Pièces d\'identité'].some((t) => i.title.includes(t.split(' ')[0])),
    )
  }
  if (filter.startsWith('status:')) return items.filter((i) => i.status === filter.replace('status:', ''))
  return items.filter((i) => i.category === filter)
}

export function DocumentsPage() {
  return (
    <ModulePage
      module="documents"
      title="Documents importants"
      subtitle="Bail, assurances, école, identité…"
      quickFilters={quickFilters}
      filterFn={docFilter}
      defaultStatus="a_recuperer"
    />
  )
}
