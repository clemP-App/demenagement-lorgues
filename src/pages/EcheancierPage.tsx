import { ModulePage } from '@/components/ModulePage'
import { PERIODS } from '@/lib/constants'
import type { Item } from '@/types'
import { isItemUrgent, isItemBlocked, isItemDone } from '@/lib/utils'
import { isToday, addDays, parseISO, startOfDay } from 'date-fns'

const PERIOD_SHORT: Record<string, string> = {
  'Avant 11 juillet': 'Av. 11 juil.',
  '11-17 juillet': '11-17 juil.',
  '18-24 juillet': '18-24 juil.',
  '25-28 juillet': '25-28 juil.',
  '29 juillet': '29 juil.',
  '30 juillet': '30 juil.',
  'Après emménagement': 'Après',
}

const quickFilters = [
  { key: 'pending', label: 'À faire', value: 'status:pending' },
  { key: 'done', label: 'Terminées', value: 'status:done' },
  { key: 'urgent', label: 'Urgent', value: 'priority:haute' },
  { key: 'blocked', label: 'Bloqué', value: 'status:bloque' },
  { key: 'today', label: 'Bientôt', value: 'today' },
  ...PERIODS.map((p) => ({
    key: p,
    label: PERIOD_SHORT[p] ?? p,
    value: p,
  })),
]

function echeancierFilter(items: Item[], filter: string): Item[] {
  if (filter === 'status:pending') return items.filter((i) => !isItemDone(i))
  if (filter === 'status:done') return items.filter(isItemDone)
  if (filter === 'today') {
    const now = startOfDay(new Date())
    const week = addDays(now, 7)
    return items.filter((i) => {
      if (isItemDone(i)) return false
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
