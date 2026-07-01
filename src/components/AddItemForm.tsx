import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import type { Item, ItemInput, ModuleType } from '@/types'
import {
  PERIODS,
  PIECES_ACTUELLES,
  PIECES_ARRIVEE,
  ECHEANCIER_CATEGORIES,
  DEMARCHES_CATEGORIES,
  getDefaultPriorities,
} from '@/lib/constants'

interface AddItemFormProps {
  module: ModuleType
  modules?: ModuleType[]
  defaultStatus: string
  onClose: () => void
  onCreated: (item: Item) => void
}

export function AddItemForm({ module, modules, defaultStatus, onClose, onCreated }: AddItemFormProps) {
  const { addItem, online } = useApp()
  const allowedModules = modules ?? [module]
  const [targetModule, setTargetModule] = useState<ModuleType>(allowedModules[0])
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('moyenne')
  const [category, setCategory] = useState('')
  const [period, setPeriod] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [responsible, setResponsible] = useState('')
  const [notes, setNotes] = useState('')
  const [pieceActuelle, setPieceActuelle] = useState<string>(PIECES_ACTUELLES[0])
  const [pieceArrivee, setPieceArrivee] = useState<string>(PIECES_ARRIVEE[0])
  const [transport, setTransport] = useState('Camion')
  const [organisme, setOrganisme] = useState('')
  const [loading, setLoading] = useState(false)

  const priorities = getDefaultPriorities(targetModule)
  const categories =
    targetModule === 'echeancier'
      ? ECHEANCIER_CATEGORIES
      : targetModule === 'demarches'
        ? DEMARCHES_CATEGORIES
        : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !online) return
    setLoading(true)
    try {
      const input: ItemInput = {
        module: targetModule,
        title: title.trim(),
        status: defaultStatus,
        priority: priority || priorities[0],
        category: category || null,
        period: period || null,
        due_date: dueDate || null,
        responsible: responsible.trim() || null,
        notes: notes.trim() || null,
        sort_order: -Date.now(),
        data: {},
      }
      if (targetModule === 'cartons') {
        input.data = {
          piece_actuelle: pieceActuelle,
          piece_arrivee: pieceArrivee,
          transport,
          contenu: title.trim(),
        }
      }
      if (targetModule === 'demarches' && organisme.trim()) {
        input.data = { organisme: organisme.trim() }
      }
      const item = await addItem(input)
      onCreated(item)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-xl sm:max-h-[90dvh] sm:rounded-2xl safe-bottom"
      >
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-800">Ajouter</h2>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {allowedModules.length > 1 && (
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">Type</span>
              <select
                value={targetModule}
                onChange={(e) => setTargetModule(e.target.value as ModuleType)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              >
                {allowedModules.includes('demarches') && <option value="demarches">Démarche</option>}
                {allowedModules.includes('cartons') && <option value="cartons">Carton</option>}
              </select>
            </label>
          )}

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Titre *</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Cartonner la chambre Elie…"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              autoFocus
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">Priorité</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>
            {categories.length > 0 && (
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-500">Catégorie</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                >
                  <option value="">—</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {targetModule === 'echeancier' && (
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-500">Période</span>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                >
                  <option value="">—</option>
                  {PERIODS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-500">Date limite</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                />
              </label>
            </div>
          )}

          {targetModule === 'demarches' && (
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">Organisme</span>
              <input
                value={organisme}
                onChange={(e) => setOrganisme(e.target.value)}
                placeholder="Ex. La Poste, ENGIE…"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              />
            </label>
          )}

          {targetModule === 'cartons' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-500">Pièce actuelle</span>
                  <select
                    value={pieceActuelle}
                    onChange={(e) => setPieceActuelle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  >
                    {PIECES_ACTUELLES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-500">Pièce d'arrivée</span>
                  <select
                    value={pieceArrivee}
                    onChange={(e) => setPieceArrivee(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  >
                    {PIECES_ARRIVEE.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-500">Transport</span>
                <select
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                >
                  <option>Camion</option>
                  <option>Voiture 1</option>
                  <option>Voiture 2</option>
                </select>
              </label>
            </>
          )}

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Responsable</span>
            <input
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              placeholder="Optionnel"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
          </label>
        </div>
        <div className="flex gap-2 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || !online || !title.trim()}
            className="flex-1 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  )
}
