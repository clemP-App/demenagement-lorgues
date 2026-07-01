import { useMemo, useState } from 'react'
import {
  format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Item } from '@/types'
import { ItemCard } from '@/components/ItemCard'
import { PERIOD_COLORS, PERIODS } from '@/lib/constants'
import { getItemCalendarDate, isItemDone } from '@/lib/utils'

interface TaskCalendarProps {
  items: Item[]
  onItemClick: (item: Item) => void
  onQuickToggle: (item: Item) => void
}

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export function TaskCalendar({ items, onItemClick, onQuickToggle }: TaskCalendarProps) {
  const [month, setMonth] = useState(() => parseISO('2026-07-01'))
  const [selected, setSelected] = useState<Date | null>(() => parseISO('2026-07-29'))

  const itemsByDate = useMemo(() => {
    const map = new Map<string, Item[]>()
    for (const item of items) {
      const d = getItemCalendarDate(item)
      if (!d) continue
      const key = format(d, 'yyyy-MM-dd')
      const list = map.get(key) ?? []
      list.push(item)
      map.set(key, list)
    }
    return map
  }, [items])

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [month])

  const selectedItems = selected
    ? (itemsByDate.get(format(selected, 'yyyy-MM-dd')) ?? [])
    : []

  const unscheduled = useMemo(
    () => items.filter((i) => !getItemCalendarDate(i)),
    [items],
  )

  return (
    <div className="min-w-0 space-y-4">
      {/* Légende périodes */}
      <div className="flex flex-wrap gap-2">
        {PERIODS.map((p) => {
          const c = PERIOD_COLORS[p]
          return (
            <span
              key={p}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium sm:text-xs ${c?.bg} ${c?.border} ${c?.text}`}
            >
              <span className={`h-2 w-2 rounded-full ${c?.dot}`} />
              {p}
            </span>
          )
        })}
      </div>

      {/* En-tête mois */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
        <button
          type="button"
          onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Mois précédent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-base font-bold capitalize text-slate-800 sm:text-lg">
          {format(month, 'MMMM yyyy', { locale: fr })}
        </h2>
        <button
          type="button"
          onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Mois suivant"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Grille calendrier */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/80">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day) => {
            const key = format(day, 'yyyy-MM-dd')
            const dayItems = itemsByDate.get(key) ?? []
            const pending = dayItems.filter((i) => !isItemDone(i)).length
            const done = dayItems.length - pending
            const inMonth = isSameMonth(day, month)
            const isSelected = selected && isSameDay(day, selected)
            const today = isToday(day)
            const periodColor = dayItems[0]?.period ? PERIOD_COLORS[dayItems[0].period] : null

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(day)}
                className={`relative min-h-[52px] border-b border-r border-slate-100 p-1 text-left transition-colors sm:min-h-[64px] sm:p-1.5 ${
                  !inMonth ? 'bg-slate-50/50 text-slate-300' : 'bg-white hover:bg-brand-50/40'
                } ${isSelected ? 'ring-2 ring-inset ring-brand-500 bg-brand-50/50' : ''}`}
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold sm:text-sm ${
                    today ? 'bg-brand-600 text-white' : inMonth ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  {format(day, 'd')}
                </span>
                {dayItems.length > 0 && inMonth && (
                  <div className="mt-0.5 flex flex-wrap gap-0.5">
                    {pending > 0 && (
                      <span className={`rounded px-1 text-[9px] font-bold text-white sm:text-[10px] ${periodColor?.dot ?? 'bg-brand-500'}`}>
                        {pending}
                      </span>
                    )}
                    {done > 0 && (
                      <span className="rounded bg-green-500 px-1 text-[9px] font-bold text-white sm:text-[10px]">
                        ✓{done}
                      </span>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Détail jour sélectionné */}
      {selected && (
        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/80 p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-bold capitalize text-slate-800">
            {format(selected, 'EEEE d MMMM', { locale: fr })}
            <span className="ml-2 font-normal text-slate-400">
              ({selectedItems.length} tâche{selectedItems.length !== 1 ? 's' : ''})
            </span>
          </h3>
          {selectedItems.length === 0 ? (
            <p className="text-sm text-slate-400">Aucune tâche ce jour-là</p>
          ) : (
            <div className="space-y-2">
              {selectedItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={() => onItemClick(item)}
                  onQuickToggle={() => onQuickToggle(item)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {unscheduled.length > 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Sans date précise ({unscheduled.length})
          </h3>
          <div className="space-y-2">
            {unscheduled.slice(0, 8).map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => onItemClick(item)}
                onQuickToggle={() => onQuickToggle(item)}
              />
            ))}
            {unscheduled.length > 8 && (
              <p className="text-xs text-slate-400">+ {unscheduled.length - 8} autres (vue Périodes)</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
