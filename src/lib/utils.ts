import { differenceInDays, isBefore, parseISO, startOfDay, isToday } from 'date-fns'
import type { Item, ModuleType, ModuleStats } from '@/types'
import { MOVE_DATE, LAST_STRETCH_DATE } from '@/types'
import {
  DONE_STATUSES,
  URGENT_PRIORITIES,
  MODULE_DONE_STATUS,
} from '@/lib/constants'

export function daysUntilMove(from = new Date()): number {
  return differenceInDays(startOfDay(MOVE_DATE), startOfDay(from))
}

export function isLastStretchMode(from = new Date()): boolean {
  return !isBefore(startOfDay(from), startOfDay(LAST_STRETCH_DATE))
}

export function isItemDone(item: Item): boolean {
  const moduleDone = MODULE_DONE_STATUS[item.module]
  if (moduleDone) return moduleDone.includes(item.status)
  return DONE_STATUSES.has(item.status)
}

export function isItemUrgent(item: Item): boolean {
  if (isItemDone(item)) return false
  if (URGENT_PRIORITIES.has(item.priority)) return true
  if (item.due_date) {
    const due = parseISO(item.due_date)
    const days = differenceInDays(due, startOfDay(new Date()))
    return days <= 3 && days >= 0
  }
  return false
}

export function isItemOverdue(item: Item): boolean {
  if (isItemDone(item) || !item.due_date) return false
  return isBefore(parseISO(item.due_date), startOfDay(new Date()))
}

export function isItemBlocked(item: Item): boolean {
  return item.status === 'bloque' || item.status === 'probleme'
}

export function getModuleStats(items: Item[], module: ModuleType): ModuleStats {
  const filtered = items.filter((i) => i.module === module)
  const total = filtered.length
  const done = filtered.filter(isItemDone).length
  const urgent = filtered.filter(isItemUrgent).length
  const blocked = filtered.filter(isItemBlocked).length
  const percent = total > 0 ? Math.round((done / total) * 100) : 0
  return { total, done, urgent, blocked, percent }
}

export function getGlobalStats(items: Item[]) {
  const total = items.length
  const done = items.filter(isItemDone).length
  const urgent = items.filter(isItemUrgent).length
  const blocked = items.filter(isItemBlocked).length
  const percent = total > 0 ? Math.round((done / total) * 100) : 0
  return { total, done, urgent, blocked, percent }
}

export function getDoNowItems(items: Item[]): Item[] {
  const today = startOfDay(new Date())
  return items
    .filter((item) => {
      if (isItemDone(item)) return false
      if (isItemBlocked(item)) return true
      if (URGENT_PRIORITIES.has(item.priority)) return true
      if (item.due_date) {
        const due = parseISO(item.due_date)
        if (isToday(due)) return true
        const days = differenceInDays(due, today)
        if (days >= 0 && days <= 7) return true
      }
      return false
    })
    .sort((a, b) => {
      if (isItemBlocked(a) && !isItemBlocked(b)) return -1
      if (!isItemBlocked(a) && isItemBlocked(b)) return 1
      if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date)
      return 0
    })
    .slice(0, 10)
}

export function getLastStretchItems(items: Item[]): Item[] {
  const periods = ['25-28 juillet', '29 juillet', '30 juillet']
  return items.filter((item) => {
    if (isItemDone(item)) return false
    if (item.module === 'echeancier' && item.period && periods.includes(item.period)) return true
    if (item.module === 'voitures' && item.data.indispensable) return true
    if (item.module === 'documents' && ['Appartement', 'Assurance'].includes(item.category ?? '')) return true
    if (item.module === 'verifications') return true
    return false
  })
}

export function searchItems(items: Item[], query: string): Item[] {
  const q = query.toLowerCase().trim()
  if (!q) return items
  return items.filter((item) => {
    const haystack = [
      item.title,
      item.status,
      item.priority,
      item.category,
      item.period,
      item.responsible,
      item.notes,
      JSON.stringify(item.data),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

export function filterItems(
  items: Item[],
  filters: {
    search?: string
    status?: string
    priority?: string
    category?: string
    responsible?: string
    period?: string
    module?: string
  },
): Item[] {
  let result = items
  if (filters.module) result = result.filter((i) => i.module === filters.module)
  if (filters.status) result = result.filter((i) => i.status === filters.status)
  if (filters.priority) result = result.filter((i) => i.priority === filters.priority)
  if (filters.category) result = result.filter((i) => i.category === filters.category)
  if (filters.responsible) result = result.filter((i) => i.responsible === filters.responsible)
  if (filters.period) result = result.filter((i) => i.period === filters.period)
  if (filters.search) result = searchItems(result, filters.search)
  return result
}

export function generateInviteCode(): string {
  return `LORGUES-${new Date().getFullYear()}`
}

export function generateCartonName(piece: string, existing: Item[]): string {
  const prefix = piece.toLowerCase().includes('cuisine')
    ? 'Carton cuisine'
    : piece.toLowerCase().includes('chambre')
      ? `Carton ${piece.toLowerCase()}`
      : `Carton ${piece.split(' ')[0].toLowerCase()}`
  const count = existing.filter(
    (i) => i.module === 'cartons' && i.title.toLowerCase().startsWith(prefix.toLowerCase()),
  ).length
  return `${prefix} ${count + 1}`
}

export function exportToCsv(items: Item[], columns: string[]): string {
  const header = columns.join(';')
  const rows = items.map((item) =>
    columns
      .map((col) => {
        const val =
          col in item
            ? (item as unknown as Record<string, unknown>)[col]
            : item.data[col as keyof typeof item.data]
        const str = val == null ? '' : String(val)
        return `"${str.replace(/"/g, '""')}"`
      })
      .join(';'),
  )
  return [header, ...rows].join('\n')
}

export function downloadFile(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
