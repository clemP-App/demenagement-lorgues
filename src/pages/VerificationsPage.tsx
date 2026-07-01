import { ModulePage } from '@/components/ModulePage'
import { VERIFICATION_JOURS } from '@/lib/constants'
import type { Item } from '@/types'

const quickFilters = VERIFICATION_JOURS.map((j) => ({
  key: j, label: j, value: j,
}))

function groupByDay(items: Item[]) {
  return VERIFICATION_JOURS.map((jour) => ({
    label: jour,
    items: items.filter((i) => i.data.jour === jour),
  })).filter((g) => g.items.length > 0)
}

export function VerificationsPage() {
  return (
    <ModulePage
      module="verifications"
      title="Dernières vérifications"
      subtitle="Mode anti-panique pour les 28, 29 et 30 juillet"
      quickFilters={quickFilters}
      filterFn={(items, filter) => items.filter((i) => i.data.jour === filter)}
      groupBy={groupByDay}
      defaultStatus="a_verifier"
    />
  )
}
