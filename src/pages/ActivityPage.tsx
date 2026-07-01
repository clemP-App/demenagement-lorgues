import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useApp } from '@/context/AppContext'
import { MODULE_LABELS, STATUS_LABELS } from '@/lib/constants'
import type { ActivityLog } from '@/types'
import { PageShell } from '@/components/PageShell'

function describeActivity(log: ActivityLog, itemTitle?: string): string {
  const nv = log.new_value ?? {}
  const title = (nv.title as string) || itemTitle || 'Élément'
  const module = nv.module as string | undefined
  const moduleLabel = module ? MODULE_LABELS[module as keyof typeof MODULE_LABELS] ?? module : ''

  switch (log.action) {
    case 'create':
      return moduleLabel
        ? `Ajout dans ${moduleLabel} : « ${title} »`
        : `Ajout : « ${title} »`
    case 'status_change': {
      const status = nv.status as string
      const label = STATUS_LABELS[status] ?? status
      return `« ${title} » marqué : ${label}`
    }
    case 'delete':
      return `Suppression : « ${title} »`
    case 'comment':
      return `Commentaire sur « ${title} »`
    default:
      return `${log.action} — ${title}`
  }
}

export function ActivityPage() {
  const { activity, items } = useApp()

  return (
    <PageShell size="sm">
      <h1 className="text-2xl font-bold text-slate-800">Activité récente</h1>
      <p className="mt-1 text-sm text-slate-500">Qui a fait quoi, en détail</p>

      <div className="mt-6 space-y-3">
        {activity.length === 0 && (
          <p className="py-12 text-center text-slate-400">Aucune activité pour le moment</p>
        )}
        {activity.map((log) => {
          const linked = log.item_id ? items.find((i) => i.id === log.item_id) : undefined
          const description = describeActivity(log, linked?.title)
          const moduleLabel = linked
            ? MODULE_LABELS[linked.module]
            : (log.new_value?.module as string | undefined)

          return (
            <div key={log.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-slate-800">{description}</p>
              <p className="mt-1 text-xs text-slate-500">
                {log.author_name}
                {moduleLabel && <span> · {moduleLabel}</span>}
                {' · '}
                {format(parseISO(log.created_at), 'd MMM yyyy à HH:mm', { locale: fr })}
              </p>
              {log.action === 'status_change' && linked && (
                <p className="mt-1 text-xs text-slate-400">
                  Module : {MODULE_LABELS[linked.module]}
                  {linked.category && ` · ${linked.category}`}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </PageShell>
  )
}
