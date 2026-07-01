import { ModulePage } from '@/components/ModulePage'
import { DEMARCHES_CATEGORIES } from '@/lib/constants'

const quickFilters = DEMARCHES_CATEGORIES.map((c) => ({
  key: c, label: c, value: c,
}))

export function DemarchesPage() {
  return (
    <ModulePage
      module="demarches"
      title="Démarches administratives"
      subtitle="Changements d'adresse, assurances, école…"
      quickFilters={quickFilters}
      defaultStatus="a_faire"
    />
  )
}
