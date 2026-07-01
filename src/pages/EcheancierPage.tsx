import { ModulePage } from '@/components/ModulePage'
import { PERIODS, ECHEANCIER_CATEGORIES } from '@/lib/constants'
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
  { key: 'urgent', label: 'Urgent', value: 'priority:haute' },
  { key: 'blocked', label: 'Bloqué', value: 'status:bloque' },
  { key: 'today', label: 'Bientôt', value: 'today' },
  { key: 'verif', label: 'Vérifications', value: 'cat:Vérification' },
  ...PERIODS.map((p) => ({
    key: p,
    label: PERIOD_SHORT[p] ?? p,
    value: p,
  })),
]

function echeancierFilter(items: Item[], filter: string): Item[] {
  if (filter === 'cat:Vérification') return items.filter((i) => i.category === 'Vérification')
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

function groupByCategory(items: Item[]) {
  const ordered = [...ECHEANCIER_CATEGORIES]
  const extra = [...new Set(items.map((i) => i.category).filter(Boolean))].filter(
    (c) => !ordered.includes(c as typeof ordered[number]),
  ) as string[]
  const allCats = [...ordered, ...extra]

  return allCats
    .map((cat) => ({
      label: cat,
      items: items.filter((i) => i.category === cat),
    }))
    .filter((g) => g.items.length > 0)
}

export function EcheancierPage() {
  return (
    <ModulePage
      module="echeancier"
      title="Tâches"
      subtitle="Ce qu'il faut faire — les plus urgentes en haut"
      quickFilters={quickFilters}
      filterFn={echeancierFilter}
      groupBy={groupByPeriod}
      groupByCategory={groupByCategory}
      defaultStatus="a_faire"
      showViewToggle
    />
  )
}
