import { Link } from 'react-router-dom'
import {
  Calendar, FileText, Package, Car, FolderOpen, Users,
  CheckSquare, Wallet, AlertTriangle, Zap,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { ProgressBar } from '@/components/ProgressBar'
import { ItemCard } from '@/components/ItemCard'
import { ItemDetailModal } from '@/components/ItemDetailModal'
import { AlertBanner } from '@/components/OfflineBanner'
import { daysUntilMove, getGlobalStats, getDoNowItems, getLastStretchItems,
  getModuleStats, isLastStretchMode, getToggledDoneStatus,
} from '@/lib/utils'
import { MODULE_PATHS } from '@/lib/constants'
import type { ModuleType } from '@/types'
import { useState } from 'react'
import { PageShell } from '@/components/PageShell'

const MODULE_CARDS: {
  module: ModuleType
  icon: typeof Calendar
  label: string
  color: string
}[] = [
  { module: 'echeancier', icon: Calendar, label: 'Échéancier', color: 'bg-blue-500' },
  { module: 'demarches', icon: FileText, label: 'Démarches', color: 'bg-purple-500' },
  { module: 'cartons', icon: Package, label: 'Cartons', color: 'bg-amber-500' },
  { module: 'voitures', icon: Car, label: 'Voitures', color: 'bg-emerald-500' },
  { module: 'documents', icon: FolderOpen, label: 'Documents', color: 'bg-rose-500' },
  { module: 'contacts', icon: Users, label: 'Contacts', color: 'bg-cyan-500' },
  { module: 'verifications', icon: CheckSquare, label: 'Vérifications', color: 'bg-orange-500' },
  { module: 'budget', icon: Wallet, label: 'Budget', color: 'bg-indigo-500' },
]

export function DashboardPage() {
  const { items, updateItem, online } = useApp()
  const [selectedItem, setSelectedItem] = useState<ReturnType<typeof useApp>['items'][0] | null>(null)

  const global = getGlobalStats(items)
  const daysLeft = daysUntilMove()
  const doNow = getDoNowItems(items)
  const lastStretch = isLastStretchMode()
  const lastStretchItems = getLastStretchItems(items)

  const voitureIndispensable = items.filter(
    (i) => i.module === 'voitures' && i.data.indispensable && i.status !== 'dans_voiture',
  ).length

  return (
    <PageShell size="lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 lg:text-3xl">Déménagement Lorgues</h1>
        <p className="mt-1 text-slate-500">Départ le 29 juillet — État des lieux le 30 juillet</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Jours restants" value={daysLeft > 0 ? String(daysLeft) : '0'} highlight={daysLeft <= 7} />
          <StatCard label="Tâches totales" value={String(global.total)} />
          <StatCard label="Tâches faites" value={String(global.done)} success />
          <StatCard label="Urgentes restantes" value={String(global.urgent)} warning={global.urgent > 0} />
        </div>

        <div className="mt-4">
          <ProgressBar percent={global.percent} size="lg" />
        </div>

        {global.blocked > 0 ? (
          <AlertBanner type="danger" message={`${global.blocked} tâche(s) bloquée(s) — à débloquer en priorité.`} />
        ) : (
          <p className="mt-3 text-sm text-green-600">Aucun élément bloqué pour le moment.</p>
        )}

        {voitureIndispensable > 0 && (
          <AlertBanner
            type="warning"
            message={`Il reste ${voitureIndispensable} élément(s) indispensable(s) à mettre dans la voiture.`}
          />
        )}
      </div>

      {/* Last stretch mode */}
      {lastStretch && (
        <div className="mb-8 rounded-2xl border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50 p-6">
          <div className="mb-4 flex items-center gap-3">
            <Zap className="h-6 w-6 text-orange-600" />
            <div>
              <h2 className="text-lg font-bold text-orange-800">Mode dernière ligne droite activé</h2>
              <p className="text-sm text-orange-600">Dernière ligne droite : concentre-toi sur l'essentiel.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {lastStretchItems.slice(0, 8).map((item) => (
              <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
            ))}
          </div>
        </div>
      )}

      {/* Module cards */}
      <h2 className="mb-4 text-lg font-semibold text-slate-700">Modules</h2>
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MODULE_CARDS.map(({ module, icon: Icon, label, color }) => {
          const stats = getModuleStats(items, module)
          const hasAlert = stats.urgent > 0 || stats.blocked > 0
          return (
            <Link
              key={module}
              to={MODULE_PATHS[module]}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand-200"
            >
              {hasAlert && (
                <span className="absolute right-3 top-3 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                </span>
              )}
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${color} text-white`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-800">{label}</h3>
              <p className="mt-1 text-xs text-slate-500">{stats.done}/{stats.total} · {stats.percent}%</p>
              <div className="mt-3">
                <ProgressBar percent={stats.percent} size="sm" showLabel={false} color={color.replace('bg-', 'bg-')} />
              </div>
              {(stats.urgent > 0 || stats.blocked > 0) && (
                <div className="mt-2 flex gap-2 text-xs">
                  {stats.urgent > 0 && (
                    <span className="flex items-center gap-1 text-orange-600">
                      <AlertTriangle className="h-3 w-3" /> {stats.urgent}
                    </span>
                  )}
                  {stats.blocked > 0 && (
                    <span className="text-red-600">{stats.blocked} bloqué(s)</span>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </div>

      {/* Do now */}
      <h2 className="mb-4 text-lg font-semibold text-slate-700">À faire maintenant</h2>
      {doNow.length === 0 ? (
        <p className="mb-8 rounded-xl bg-green-50 p-4 text-sm text-green-700">
          Bien joué, rien d'urgent pour le moment !
        </p>
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-2 lg:grid-cols-2">
          {doNow.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              showModule
              onClick={() => setSelectedItem(item)}
              onQuickToggle={online ? async () => {
                await updateItem(item.id, { status: getToggledDoneStatus(item) })
              } : undefined}
            />
          ))}
        </div>
      )}

      <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </PageShell>
  )
}

function StatCard({
  label, value, highlight, success, warning,
}: {
  label: string; value: string; highlight?: boolean; success?: boolean; warning?: boolean
}) {
  return (
    <div className={`rounded-2xl border p-4 ${
      highlight ? 'border-orange-200 bg-orange-50' :
      success ? 'border-green-200 bg-green-50' :
      warning ? 'border-red-200 bg-red-50' :
      'border-slate-200 bg-white'
    }`}>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${
        highlight ? 'text-orange-700' : success ? 'text-green-700' : warning ? 'text-red-700' : 'text-slate-800'
      }`}>{value}</p>
    </div>
  )
}
