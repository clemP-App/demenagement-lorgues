import { useState, useMemo } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import type { Item, ModuleType } from '@/types'
import { useApp } from '@/context/AppContext'
import { ItemCard } from '@/components/ItemCard'
import { ItemDetailModal } from '@/components/ItemDetailModal'
import { SearchBar, FilterChips } from '@/components/SearchBar'
import { ProgressBar } from '@/components/ProgressBar'
import { ViewToggle, type ListViewMode } from '@/components/ViewToggle'
import { TaskCalendar } from '@/components/TaskCalendar'
import { filterItems, getModuleStats, sortItemsPendingFirst, getToggledDoneStatus } from '@/lib/utils'
import { PageShell } from '@/components/PageShell'
import { PERIOD_COLORS } from '@/lib/constants'

interface ModulePageProps {
  module: ModuleType
  title: string
  subtitle?: string
  quickFilters?: { key: string; label: string; value: string }[]
  filterFn?: (items: Item[], filter: string) => Item[]
  groupBy?: (items: Item[]) => { label: string; items: Item[] }[]
  groupByCategory?: (items: Item[]) => { label: string; items: Item[] }[]
  defaultStatus?: string
  onAdd?: () => void
  children?: React.ReactNode
  showViewToggle?: boolean
}

export function ModulePage({
  module,
  title,
  subtitle,
  quickFilters = [],
  filterFn,
  groupBy,
  groupByCategory,
  defaultStatus = 'a_faire',
  onAdd,
  children,
  showViewToggle = false,
}: ModulePageProps) {
  const { items, itemsLoading, updateItem, online } = useApp()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [listViewMode, setListViewMode] = useState<ListViewMode>('period')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const moduleItems = useMemo(() => {
    let result = items.filter((i) => i.module === module)
    result = filterItems(result, { search })
    if (activeFilter && filterFn) result = filterFn(result, activeFilter)
    else if (activeFilter) {
      if (activeFilter.startsWith('status:')) {
        result = result.filter((i) => i.status === activeFilter.replace('status:', ''))
      } else if (activeFilter.startsWith('priority:')) {
        result = result.filter((i) => i.priority === activeFilter.replace('priority:', ''))
      } else {
        result = result.filter((i) =>
          i.category === activeFilter ||
          i.period === activeFilter ||
          i.data?.voiture === activeFilter ||
          i.data?.piece_actuelle === activeFilter ||
          i.data?.piece_arrivee === activeFilter ||
          i.data?.jour === activeFilter,
        )
      }
    }
    return result
  }, [items, module, search, activeFilter, filterFn])

  const stats = getModuleStats(items, module)

  const activeGroupBy =
    listViewMode === 'category' && groupByCategory
      ? groupByCategory
      : listViewMode === 'period' && groupBy
        ? groupBy
        : null

  const groups = activeGroupBy
    ? activeGroupBy(moduleItems).map((g) => ({ ...g, items: sortItemsPendingFirst(g.items) }))
    : [{ label: '', items: sortItemsPendingFirst(moduleItems) }]

  const handleQuickToggle = async (item: Item) => {
    if (!online) return
    await updateItem(item.id, { status: getToggledDoneStatus(item) })
  }

  return (
    <PageShell size="lg">
      <div className="mb-6 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-1 break-words text-sm text-slate-500">{subtitle}</p>}
          <div className="mt-3 w-full max-w-xs">
            <ProgressBar percent={stats.percent} size="sm" />
            <p className="mt-1 text-xs text-slate-500">
              {stats.done}/{stats.total} terminés
              {stats.urgent > 0 && <span className="ml-2 text-orange-600">· {stats.urgent} urgent(s)</span>}
              {stats.blocked > 0 && <span className="ml-2 text-red-600">· {stats.blocked} bloqué(s)</span>}
            </p>
          </div>
        </div>
        <button
          onClick={onAdd ?? (() => setShowAdd(true))}
          disabled={!online}
          className="flex shrink-0 touch-target items-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50 sm:py-2.5"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Ajouter</span>
        </button>
      </div>

      {children}

      <div className="mb-4 min-w-0 space-y-3">
        <SearchBar value={search} onChange={setSearch} />
        {showViewToggle && (
          <ViewToggle value={listViewMode} onChange={setListViewMode} />
        )}
        {quickFilters.length > 0 && (
          <div className="min-w-0">
            <FilterChips filters={[{ key: 'all', label: 'Toutes', value: '' }, ...quickFilters]}
              active={activeFilter} onChange={setActiveFilter} />
          </div>
        )}
      </div>

      {itemsLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      ) : moduleItems.length === 0 ? (
        <p className="py-12 text-center text-slate-400">Aucun élément trouvé</p>
      ) : listViewMode === 'calendar' && showViewToggle ? (
        <TaskCalendar
          items={moduleItems}
          onItemClick={setSelectedItem}
          onQuickToggle={handleQuickToggle}
        />
      ) : (
        <div className="min-w-0 space-y-6">
          {groups.map((group) => (
            <div key={group.label || 'all'} className="min-w-0">
              {group.label && (
                <div className="mb-3 flex items-center gap-2">
                  {PERIOD_COLORS[group.label] && (
                    <span className={`h-2.5 w-2.5 rounded-full ${PERIOD_COLORS[group.label].dot}`} />
                  )}
                  <h2 className="break-words text-sm font-bold text-slate-700">
                    {group.label}
                    <span className="ml-1.5 font-normal text-slate-400">({group.items.length})</span>
                  </h2>
                </div>
              )}
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                {group.items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onClick={() => setSelectedItem(item)}
                    onQuickToggle={() => handleQuickToggle(item)}
                    onQuickComment={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <AddItemModal
          module={module}
          defaultStatus={defaultStatus}
          onClose={() => setShowAdd(false)}
        />
      )}

      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </PageShell>
  )
}

function AddItemModal({
  module,
  defaultStatus,
  onClose,
}: {
  module: ModuleType
  defaultStatus: string
  onClose: () => void
}) {
  const { addItem, online } = useApp()
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !online) return
    setLoading(true)
    try {
      await addItem({ module, title: title.trim(), status: defaultStatus })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-bold">Ajouter un élément</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre…"
          className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
          autoFocus
        />
        <div className="flex gap-2">
          <button type="button" onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium">
            Annuler
          </button>
          <button type="submit" disabled={loading || !online}
            className="flex-1 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white disabled:opacity-50">
            Ajouter
          </button>
        </div>
      </form>
    </div>
  )
}

export { AddItemModal }
