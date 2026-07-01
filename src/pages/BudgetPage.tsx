import { useMemo, useState } from 'react'
import type { Item } from '@/types'
import { useApp } from '@/context/AppContext'
import { ItemDetailModal } from '@/components/ItemDetailModal'
import { StatusBadge } from '@/components/Badge'
import { BUDGET_CATEGORIES } from '@/lib/constants'

export function BudgetPage() {
  const { items } = useApp()
  const [selected, setSelected] = useState<Item | null>(null)

  const budgetItems = items.filter((i) => i.module === 'budget')

  const totals = useMemo(() => {
    let estime = 0, reel = 0, reste = 0, sansJustificatif = 0
    for (const item of budgetItems) {
      estime += item.data.montant_estime ?? 0
      reel += item.data.montant_reel ?? 0
      if (!item.data.paye) reste += item.data.montant_estime ?? 0
      if (!item.data.justificatif_conserve && item.data.montant_reel) sansJustificatif++
    }
    return { estime, reel, reste, sansJustificatif }
  }, [budgetItems])

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-800">Dépenses / Budget</h1>
      <p className="mt-1 text-sm text-slate-500">Suivi des frais de déménagement</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <BudgetCard label="Total estimé" value={`${totals.estime.toLocaleString('fr-FR')} €`} />
        <BudgetCard label="Total réel" value={`${totals.reel.toLocaleString('fr-FR')} €`} />
        <BudgetCard label="Reste à payer" value={`${totals.reste.toLocaleString('fr-FR')} €`} highlight />
        <BudgetCard label="Sans justificatif" value={String(totals.sansJustificatif)} warning={totals.sansJustificatif > 0} />
      </div>

      <div className="mt-8 space-y-6">
        {BUDGET_CATEGORIES.map((cat) => {
          const catItems = budgetItems.filter((i) => i.category === cat)
          if (catItems.length === 0) return null
          return (
            <div key={cat}>
              <h2 className="mb-3 text-sm font-semibold uppercase text-slate-400">{cat}</h2>
              <div className="space-y-2">
                {catItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left hover:shadow-sm"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{item.title}</p>
                      <StatusBadge status={item.status} small />
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">
                        {(item.data.montant_estime ?? 0).toLocaleString('fr-FR')} €
                      </p>
                      {item.data.montant_reel ? (
                        <p className="text-xs text-slate-500">
                          Réel : {item.data.montant_reel.toLocaleString('fr-FR')} €
                        </p>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <ItemDetailModal item={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

function BudgetCard({ label, value, highlight, warning }: {
  label: string; value: string; highlight?: boolean; warning?: boolean
}) {
  return (
    <div className={`rounded-2xl border p-4 ${
      highlight ? 'border-brand-200 bg-brand-50' :
      warning ? 'border-orange-200 bg-orange-50' : 'border-slate-200 bg-white'
    }`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
    </div>
  )
}
