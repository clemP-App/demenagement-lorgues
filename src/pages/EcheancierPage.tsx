import { ModulePage } from '@/components/ModulePage'
import { PERIODS } from '@/lib/constants'
import type { Item } from '@/types'
import { isItemUrgent, isItemBlocked } from '@/lib/utils'
import { isToday, addDays, parseISO, startOfDay } from 'date-fns'

const quickFilters = [
  { key: 'urgent', label: 'Urgent', value: 'priority:haute' },
  { key: 'blocked', label: 'Bloqué', value: 'status:bloque' },
  { key: 'today', label: 'Aujourd\'hui', value: 'today' },
  ...PERIODS.map((p) => ({ key: p, label: p, value: p })),
]

function echeancierFilter(items: Item[], filter: string): Item[] {
  if (filter === 'today') {
    const now = startOfDay(new Date())
    const week = addDays(now, 7)
    return items.filter((i) => {
      if (!i.due_date) return isItemUrgent(i)
      const d = parseISO(i.due_date)
      return isToday(d) || (d >= now && d <= week)
    })
  }
  if (filter === 'priority:haute') return items.filter(isItemUrgent)
  if (filter === 'status:bloque') return items.filter(isItemBlocked)
  return items.filter((i) => i.period === filter)
}

function groupByPeriod(items: Item[]) {
  return PERIODS.map((period) => ({
    label: period,
    items: items.filter((i) => i.period === period),
  })).filter((g) => g.items.length > 0)
}

export function EcheancierPage() {
  return (
    <ModulePage
      module="echeancier"
      title="Échéancier"
      subtitle="Toutes vos tâches par période"
      quickFilters={quickFilters}
      filterFn={echeancierFilter}
      groupBy={groupByPeriod}
      defaultStatus="a_faire"
    />
  )
}
