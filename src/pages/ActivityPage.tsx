import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useApp } from '@/context/AppContext'

import { PageShell } from '@/components/PageShell'

export function ActivityPage() {
  const { activity } = useApp()

  return (
    <PageShell size="sm">
      <h1 className="text-2xl font-bold text-slate-800">Activité récente</h1>
      <p className="mt-1 text-sm text-slate-500">Historique des modifications</p>

      <div className="mt-6 space-y-3">
        {activity.length === 0 && (
          <p className="text-center text-slate-400 py-12">Aucune activité pour le moment</p>
        )}
        {activity.map((log) => (
          <div key={log.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {log.action === 'create' && 'Création'}
                  {log.action === 'status_change' && `Statut → ${(log.new_value as { status?: string })?.status ?? '?'}`}
                  {log.action === 'delete' && 'Suppression'}
                  {!['create', 'status_change', 'delete'].includes(log.action) && log.action}
                </p>
                <p className="text-xs text-slate-400">
                  {log.author_name} — {format(parseISO(log.created_at), 'd MMM yyyy à HH:mm', { locale: fr })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
