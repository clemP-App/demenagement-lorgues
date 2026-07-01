import { ModulePage } from '@/components/ModulePage'
import { DEMARCHES_CATEGORIES } from '@/lib/constants'
import type { Item } from '@/types'

const quickFilters = DEMARCHES_CATEGORIES.map((c) => ({
  key: c, label: c, value: c,
}))

function groupByCategory(items: Item[]) {
  return DEMARCHES_CATEGORIES.map((cat) => ({
    label: cat,
    items: items.filter((i) => i.category === cat),
  })).filter((g) => g.items.length > 0)
}

export function DemarchesPage() {
  return (
    <ModulePage
      module="demarches"
      title="Démarches administratives"
      subtitle="Changements d'adresse, assurances, école, énergie…"
      quickFilters={quickFilters}
      groupBy={groupByCategory}
      defaultStatus="a_faire"
    />
  )
}
