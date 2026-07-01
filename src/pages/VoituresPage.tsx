import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import type { Item } from '@/types'
import { useApp } from '@/context/AppContext'
import { ProgressBar } from '@/components/ProgressBar'
import { PriorityBadge } from '@/components/Badge'
import { ItemDetailModal } from '@/components/ItemDetailModal'
import { VOITURES } from '@/lib/constants'
import { isItemDone } from '@/lib/utils'

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
    <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-800">À emporter en voiture</h1>
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
              {colItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 rounded-xl border p-3 ${
                    item.data.indispensable && item.status !== 'dans_voiture'
                      ? 'border-red-200 bg-red-50/50'
                      : 'border-slate-100'
                  }`}
                >
                  <button
                    onClick={() => online && updateItem(item.id, { status: 'dans_voiture' })}
                    disabled={!online || item.status === 'dans_voiture'}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      item.status === 'dans_voiture'
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-100 text-slate-400 hover:bg-green-100 hover:text-green-600'
                    }`}
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => setSelected(item)} className="flex-1 text-left">
                    <p className="font-medium text-slate-800">{item.title}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <PriorityBadge priority={item.priority} small />
                      {item.category && <span className="text-xs text-slate-400">{item.category}</span>}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ItemDetailModal item={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
