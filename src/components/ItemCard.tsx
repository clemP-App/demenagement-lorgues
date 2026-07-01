import { ChevronRight, MessageSquare, Check, Sparkles } from 'lucide-react'
import type { Item } from '@/types'
import { StatusBadge, PriorityBadge } from '@/components/Badge'
import { isItemUrgent, isItemBlocked, isItemOverdue, isItemDone } from '@/lib/utils'
import { CATEGORY_ACCENT, PERIOD_COLORS } from '@/lib/constants'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ItemCardProps {
  item: Item
  onClick: () => void
  onQuickToggle?: () => void
  onQuickComment?: () => void
  showModule?: boolean
}

function getAccent(item: Item): string {
  if (item.category && CATEGORY_ACCENT[item.category]) return CATEGORY_ACCENT[item.category]
  if (item.period && PERIOD_COLORS[item.period]) {
    const dot = PERIOD_COLORS[item.period].dot
    if (dot.includes('violet')) return 'from-violet-500 to-purple-500'
    if (dot.includes('blue')) return 'from-blue-500 to-indigo-500'
    if (dot.includes('cyan')) return 'from-cyan-500 to-teal-500'
    if (dot.includes('amber')) return 'from-amber-500 to-orange-500'
    if (dot.includes('orange')) return 'from-orange-500 to-red-500'
    if (dot.includes('rose')) return 'from-rose-500 to-pink-500'
  }
  return 'from-brand-500 to-indigo-500'
}

export function ItemCard({ item, onClick, onQuickToggle, onQuickComment, showModule }: ItemCardProps) {
  const done = isItemDone(item)
  const urgent = isItemUrgent(item)
  const blocked = isItemBlocked(item)
  const overdue = isItemOverdue(item)
  const accent = getAccent(item)

  const metaParts: { text: string; highlight?: boolean }[] = []
  if (item.category) metaParts.push({ text: item.category })
  if (item.period) metaParts.push({ text: item.period })
  if (item.due_date) {
    metaParts.push({
      text: format(parseISO(item.due_date), 'd MMM', { locale: fr }),
      highlight: overdue && !done,
    })
  }
  if (item.responsible) metaParts.push({ text: `→ ${item.responsible}` })
  if (showModule) metaParts.push({ text: item.module })

  return (
    <div
      className={`group relative flex min-w-0 gap-0 overflow-hidden rounded-2xl transition-all duration-200 ${
        done
          ? 'bg-gradient-to-br from-green-50/90 to-emerald-50/50 shadow-sm ring-1 ring-green-200/60'
          : blocked
            ? 'bg-gradient-to-br from-red-50/80 to-white shadow-sm ring-1 ring-red-200/50'
            : urgent || overdue
              ? 'bg-gradient-to-br from-orange-50/60 to-white shadow-md ring-1 ring-orange-200/60'
              : 'bg-white/90 shadow-sm ring-1 ring-slate-200/70 hover:shadow-md hover:ring-brand-200/50 backdrop-blur-sm'
      }`}
    >
      {/* Bandeau couleur */}
      <div className={`w-1 shrink-0 bg-gradient-to-b ${done ? 'from-green-400 to-emerald-500' : accent}`} />

      <div className="flex min-w-0 flex-1 gap-2 p-2.5 pl-2 sm:p-3">
        {onQuickToggle && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onQuickToggle()
            }}
            aria-label={done ? 'Marquer à faire' : 'Valider'}
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
              done
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-sm shadow-green-200 hover:scale-105'
                : 'border-2 border-slate-200/80 bg-slate-50/80 text-transparent hover:border-green-400 hover:bg-green-50'
            }`}
          >
            {done ? (
              <Check className="h-4 w-4" strokeWidth={3} />
            ) : (
              <span className="h-2 w-2 rounded-full bg-slate-200 group-hover:bg-green-300" />
            )}
          </button>
        )}

        <button type="button" onClick={onClick} className="min-w-0 flex-1 text-left">
          <div className="flex min-w-0 items-start gap-1">
            <h3
              className={`min-w-0 flex-1 break-words text-sm font-semibold leading-snug tracking-tight ${
                done ? 'text-slate-400 line-through decoration-green-500/40' : 'text-slate-800'
              }`}
            >
              {item.title}
            </h3>
            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-brand-500" />
          </div>

          {!done && (urgent || overdue || blocked || (item.status && item.status !== 'a_faire') || item.priority) && (
            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              {item.status && item.status !== 'a_faire' && <StatusBadge status={item.status} small />}
              {item.priority && <PriorityBadge priority={item.priority} small />}
              {urgent && !blocked && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                  <Sparkles className="h-2.5 w-2.5" />
                  Urgent
                </span>
              )}
              {overdue && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                  Retard
                </span>
              )}
            </div>
          )}

          {done && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-green-100/80 px-2 py-0.5 text-[10px] font-semibold text-green-700">
              <Check className="h-3 w-3" />
              Terminé
            </span>
          )}

          {metaParts.length > 0 && (
            <p className={`mt-1 truncate text-[11px] ${done ? 'text-slate-400' : 'text-slate-500'}`}>
              {metaParts.map((part, i) => (
                <span key={i}>
                  {i > 0 && <span className="mx-1 text-slate-300">·</span>}
                  <span className={part.highlight ? 'font-semibold text-red-600' : ''}>{part.text}</span>
                </span>
              ))}
            </p>
          )}
        </button>

        {onQuickComment && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onQuickComment()
            }}
            aria-label="Commenter"
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-600"
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
