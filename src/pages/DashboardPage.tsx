import { Link } from 'react-router-dom'
import {
  Calendar, Package, Car, FolderOpen, Wallet, AlertTriangle, Zap,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { ProgressBar } from '@/components/ProgressBar'
import { ItemCard } from '@/components/ItemCard'
import { ItemDetailModal } from '@/components/ItemDetailModal'
import { AlertBanner } from '@/components/OfflineBanner'
import {
  daysUntilMove,
  getDashboardTaskStats,
  getModulesStats,
  getDoNowItems,
  getLastStretchItems,
  getModuleStats,
  isLastStretchMode,
  getToggledDoneStatus,
} from '@/lib/utils'
import { useState } from 'react'
import { PageShell } from '@/components/PageShell'

const MODULE_CARDS = [
  { to: '/echeancier', icon: Calendar, label: 'Tâches', color: 'bg-blue-500', statsKey: 'echeancier' as const },
  { to: '/preparation', icon: Package, label: 'Préparation', color: 'bg-amber-500', statsKey: 'prep' as const },
  { to: '/voitures', icon: Car, label: 'Voitures', color: 'bg-emerald-500', statsKey: 'voitures' as const },
  { to: '/budget', icon: Wallet, label: 'Budget', color: 'bg-indigo-500', statsKey: 'budget' as const },
  { to: '/documents', icon: FolderOpen, label: 'Documents', color: 'bg-rose-500', statsKey: 'documents' as const },
]

export function DashboardPage() {
  const { items, updateItem, online } = useApp()
  const [selectedItem, setSelectedItem] = useState<ReturnType<typeof useApp>['items'][0] | null>(null)

  const taskStats = getDashboardTaskStats(items)
  const daysLeft = daysUntilMove()
  const echeancierItems = items.filter((i) => i.module === 'echeancier')
  const doNow = getDoNowItems(echeancierItems)
  const lastStretch = isLastStretchMode()
  const lastStretchItems = getLastStretchItems(echeancierItems)

  const voitureIndispensable = items.filter(
    (i) => i.module === 'voitures' && i.data.indispensable && i.status !== 'dans_voiture',
  ).length

  const getCardStats = (key: string) => {
    if (key === 'prep') return getModulesStats(items, ['demarches', 'cartons'])
    return getModuleStats(items, key as 'echeancier' | 'voitures' | 'budget' | 'documents')
  }

  return (
    <PageShell size="lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Déménagement Lorgues</h1>
        <p className="mt-1 text-sm text-slate-500">Départ le 29 juillet — État des lieux le 30</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <StatCard label="Jours restants" value={daysLeft > 0 ? String(daysLeft) : '0'} highlight={daysLeft <= 7} />
          <StatCard label="Tâches totales" value={String(taskStats.total)} subtitle="échéancier" />
          <StatCard label="Tâches faites" value={String(taskStats.done)} success />
          <StatCard label="Urgentes restantes" value={String(taskStats.urgent)} warning={taskStats.urgent > 0} />
        </div>

        <div className="mt-4">
          <ProgressBar percent={taskStats.percent} size="lg" />
          <p className="mt-1 text-center text-xs text-slate-500">
            {taskStats.done}/{taskStats.total} tâches terminées
          </p>
        </div>

        {taskStats.blocked > 0 && (
          <AlertBanner type="danger" message={`${taskStats.blocked} tâche(s) bloquée(s) — priorité absolue.`} />
        )}

        {voitureIndispensable > 0 && (
          <AlertBanner
            type="warning"
            message={`${voitureIndispensable} indispensable(s) pas encore en voiture.`}
          />
        )}
      </div>

      {lastStretch && (
        <div className="mb-6 rounded-2xl border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            <h2 className="font-bold text-orange-800">Dernière ligne droite</h2>
          </div>
          <div className="space-y-2">
            {lastStretchItems.slice(0, 6).map((item) => (
              <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-3 text-base font-semibold text-slate-700">À faire maintenant</h2>
      {doNow.length === 0 ? (
        <p className="mb-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
          Rien d'urgent — consultez l'onglet Tâches.
        </p>
      ) : (
        <div className="mb-6 space-y-2">
          {doNow.slice(0, 8).map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => setSelectedItem(item)}
              onQuickToggle={online ? async () => {
                await updateItem(item.id, { status: getToggledDoneStatus(item) })
              } : undefined}
            />
          ))}
        </div>
      )}

      <h2 className="mb-3 text-base font-semibold text-slate-700">Sections</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {MODULE_CARDS.map(({ to, icon: Icon, label, color, statsKey }) => {
          const stats = getCardStats(statsKey)
          return (
            <Link
              key={to}
              to={to}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-brand-200 hover:shadow-md"
            >
              <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${color} text-white`}>
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">{label}</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {stats.done}/{stats.total}
                {stats.urgent > 0 && (
                  <span className="ml-1 text-orange-600">
                    <AlertTriangle className="inline h-3 w-3" /> {stats.urgent}
                  </span>
                )}
              </p>
            </Link>
          )
        })}
      </div>

      <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </PageShell>
  )
}

function StatCard({
  label, value, subtitle, highlight, success, warning,
}: {
  label: string
  value: string
  subtitle?: string
  highlight?: boolean
  success?: boolean
  warning?: boolean
}) {
  return (
    <div className={`rounded-2xl border p-3 sm:p-4 ${
      highlight ? 'border-orange-200 bg-orange-50' :
      success ? 'border-green-200 bg-green-50' :
      warning ? 'border-red-200 bg-red-50' :
      'border-slate-200 bg-white'
    }`}>
      <p className="text-[10px] font-medium leading-tight text-slate-500 sm:text-xs">{label}</p>
      <p className={`mt-0.5 text-2xl font-bold sm:text-3xl ${
        highlight ? 'text-orange-700' : success ? 'text-green-700' : warning ? 'text-red-700' : 'text-slate-800'
      }`}>{value}</p>
      {subtitle && <p className="text-[10px] text-slate-400">{subtitle}</p>}
    </div>
  )
}
