import { useState } from 'react'
import { ModulePage } from '@/components/ModulePage'
import { PIECES_ACTUELLES, PIECES_ARRIVEE } from '@/lib/constants'
import type { Item } from '@/types'
import { useApp } from '@/context/AppContext'
import { generateCartonName } from '@/lib/utils'

const quickFilters = [
  { key: 'p1', label: 'P1 urgent', value: 'priority:p1' },
  { key: 'fragile', label: 'Fragile', value: 'fragile' },
  { key: 'camion', label: 'Camion', value: 'transport:Camion' },
  { key: 'v1', label: 'Voiture 1', value: 'transport:Voiture 1' },
  { key: 'v2', label: 'Voiture 2', value: 'transport:Voiture 2' },
  ...PIECES_ACTUELLES.map((p) => ({ key: p, label: p, value: `piece:${p}` })),
]

function cartonFilter(items: Item[], filter: string): Item[] {
  if (filter === 'fragile') return items.filter((i) => i.data.fragile)
  if (filter.startsWith('transport:')) return items.filter((i) => i.data.transport === filter.replace('transport:', ''))
  if (filter.startsWith('piece:')) return items.filter((i) => i.data.piece_actuelle === filter.replace('piece:', ''))
  if (filter.startsWith('priority:')) return items.filter((i) => i.priority === filter.replace('priority:', ''))
  return items
}

function groupByPiece(items: Item[]) {
  return PIECES_ACTUELLES.map((piece) => ({
    label: piece,
    items: items.filter((i) => i.data.piece_actuelle === piece),
  })).filter((g) => g.items.length > 0)
}

export function CartonsPage() {
  const { items, addItem, online } = useApp()
  const [showQuick, setShowQuick] = useState(false)
  const [piece, setPiece] = useState(PIECES_ACTUELLES[0])
  const [arrivee, setArrivee] = useState(PIECES_ARRIVEE[0])
  const [priority, setPriority] = useState('p2')
  const [transport, setTransport] = useState('Camion')

  const handleQuickAdd = async () => {
    if (!online) return
    const cartons = items.filter((i) => i.module === 'cartons')
    const name = generateCartonName(piece, cartons)
    await addItem({
      module: 'cartons',
      title: name,
      status: 'a_faire',
      priority,
      data: { piece_actuelle: piece, piece_arrivee: arrivee, transport, fragile: false },
    })
    setShowQuick(false)
  }

  return (
    <>
      <ModulePage
        module="cartons"
        title="Cartons et pièces"
        subtitle="Suivi visuel du cartonnage"
        quickFilters={quickFilters}
        filterFn={cartonFilter}
        groupBy={groupByPiece}
        defaultStatus="a_faire"
        onAdd={() => setShowQuick(true)}
      />

      {showQuick && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-bold">Créer rapidement un carton</h2>
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs text-slate-500">Pièce actuelle</span>
                <select value={piece} onChange={(e) => setPiece(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
                  {PIECES_ACTUELLES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-slate-500">Pièce d'arrivée</span>
                <select value={arrivee} onChange={(e) => setArrivee(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
                  {PIECES_ARRIVEE.map((p) => <option key={p}>{p}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-slate-500">Priorité ouverture</span>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
                  <option value="p1">P1 urgent</option>
                  <option value="p2">P2 semaine 1</option>
                  <option value="p3">P3 plus tard</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-slate-500">Transport</span>
                <select value={transport} onChange={(e) => setTransport(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
                  <option>Camion</option>
                  <option>Voiture 1</option>
                  <option>Voiture 2</option>
                </select>
              </label>
              <p className="text-sm text-slate-500">
                Nom proposé : <strong>{generateCartonName(piece, items.filter((i) => i.module === 'cartons'))}</strong>
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setShowQuick(false)}
                className="flex-1 rounded-xl border py-3 text-sm">Annuler</button>
              <button onClick={handleQuickAdd} disabled={!online}
                className="flex-1 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white">
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
