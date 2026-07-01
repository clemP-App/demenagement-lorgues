import { ChevronRight, MessageSquare, Check, CheckCircle2 } from 'lucide-react'
import type { Item } from '@/types'
import { StatusBadge, PriorityBadge } from '@/components/Badge'
import { isItemUrgent, isItemBlocked, isItemOverdue, isItemDone } from '@/lib/utils'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ItemCardProps {
  item: Item
  onClick: () => void
  onQuickDone?: () => void
  onQuickComment?: () => void
  showModule?: boolean
}

export function ItemCard({ item, onClick, onQuickDone, onQuickComment, showModule }: ItemCardProps) {
  const done = isItemDone(item)
  const urgent = isItemUrgent(item)
  const blocked = isItemBlocked(item)
  const overdue = isItemOverdue(item)

  return (
    <div
      className={`group relative min-w-0 overflow-hidden rounded-2xl border p-4 shadow-sm transition-all ${
        done
          ? 'border-green-200 bg-green-50/70'
          : blocked
            ? 'border-red-200 bg-red-50/30'
            : urgent || overdue
              ? 'border-orange-200 bg-white'
              : 'border-slate-200 bg-white hover:shadow-md'
      }`}
    >
      <button onClick={onClick} className="w-full min-w-0 text-left">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {done ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-semibold text-white">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Terminé
            </span>
          ) : (
            <>
              <StatusBadge status={item.status} small />
              <PriorityBadge priority={item.priority} small />
              {urgent && !blocked && (
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                  Urgent
                </span>
              )}
              {overdue && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  En retard
                </span>
              )}
            </>
          )}
        </div>
        <h3
          className={`mb-1 break-words text-base font-semibold sm:text-sm ${
            done ? 'text-slate-500 line-through decoration-green-600/50' : 'text-slate-800'
          }`}
        >
          {item.title}
        </h3>
        <div className={`flex flex-wrap gap-x-3 gap-y-1 text-xs ${done ? 'text-slate-400' : 'text-slate-500'}`}>
          {item.category && <span>{item.category}</span>}
          {item.period && <span>{item.period}</span>}
          {item.due_date && (
            <span className={overdue && !done ? 'font-medium text-red-600' : ''}>
              {format(parseISO(item.due_date), 'd MMM', { locale: fr })}
            </span>
          )}
          {item.responsible && <span>→ {item.responsible}</span>}
          {showModule && <span className="capitalize">{item.module}</span>}
        </div>
      </button>
      <div className="mt-3 flex flex-wrap gap-2">
        {onQuickDone && !done && (
          <button
            onClick={(e) => { e.stopPropagation(); onQuickDone() }}
            className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-2.5 text-xs font-medium text-green-700 hover:bg-green-100 sm:py-1.5"
          >
            <Check className="h-3.5 w-3.5" />
            Valider
          </button>
        )}
        {onQuickComment && (
          <button
            onClick={(e) => { e.stopPropagation(); onQuickComment() }}
            className="flex items-center gap-1 rounded-lg bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 sm:py-1.5"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Commenter
          </button>
        )}
        <button onClick={onClick} className="ml-auto text-slate-300 group-hover:text-brand-500">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
