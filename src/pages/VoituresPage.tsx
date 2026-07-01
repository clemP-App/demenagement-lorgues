import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import type { Item } from '@/types'
import { useApp } from '@/context/AppContext'
import { ProgressBar } from '@/components/ProgressBar'
import { PriorityBadge } from '@/components/Badge'
import { ItemDetailModal } from '@/components/ItemDetailModal'
import { VOITURES } from '@/lib/constants'
import { PageShell } from '@/components/PageShell'
import { isItemDone, getToggledDoneStatus } from '@/lib/utils'

export function VoituresPage() {
  const { items, updateItem, online } = useApp()
  const [selected, setSelected] = useState<Item | null>(null)

  const voitureItems = items.filter((i) => i.module === 'voitures')

  const columns = useMemo(() =>
    VOITURES.map((v) => {
      const colItems = voitureItems.filter((i) => i.data.voiture === v)
      const done = colItems.filter(isItemDone).length
      return { voiture: v, items: colItems, done, total: colItems.length, percent: colItems.length ? Math.round((done / colItems.length) * 100) : 0 }
    }),
  [voitureItems])

  const indispensableMissing = voitureItems.filter(
    (i) => i.data.indispensable && i.status !== 'dans_voiture',
  ).length

  return (
    <PageShell size="lg">
      <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">À emporter en voiture</h1>
      <p className="mt-1 text-sm text-slate-500">Évitez que l'essentiel parte dans le camion</p>

      {indispensableMissing > 0 && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Attention : {indispensableMissing} élément(s) indispensable(s) pas encore dans la voiture !
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {columns.map(({ voiture, items: colItems, done, total, percent }) => (
          <div key={voiture} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">{voiture}</h2>
              <span className="text-sm text-slate-500">{done}/{total}</span>
            </div>
            <ProgressBar percent={percent} size="sm" />
            <div className="mt-4 space-y-2">
              {colItems.map((item) => {
                const itemDone = isItemDone(item)
                return (
                <div
                  key={item.id}
                  className={`flex min-w-0 items-center gap-2 rounded-lg border p-2 ${
                    itemDone
                      ? 'border-green-200 bg-green-50/70'
                      : item.data.indispensable && item.status !== 'dans_voiture'
                        ? 'border-red-200 bg-red-50/50'
                        : 'border-slate-100 bg-white'
                  }`}
                >
                  <button
                    onClick={() => online && updateItem(item.id, { status: getToggledDoneStatus(item) })}
                    disabled={!online}
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      itemDone
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'border border-slate-200 bg-slate-50 text-slate-300 hover:border-green-300 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    {itemDone && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </button>
                  <button onClick={() => setSelected(item)} className="min-w-0 flex-1 text-left">
                    <p className={`break-words font-medium ${itemDone ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                      {item.title}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {!itemDone && <PriorityBadge priority={item.priority} small />}
                      {item.category && <span className="text-xs text-slate-400">{item.category}</span>}
                    </div>
                  </button>
                </div>
              )})}
            </div>
          </div>
        ))}
      </div>

      <ItemDetailModal item={selected} onClose={() => setSelected(null)} />
    </PageShell>
  )
}
