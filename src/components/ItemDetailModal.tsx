import { useState, useEffect } from 'react'
import { X, Trash2, Check, Play, Ban } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Item, ModuleType } from '@/types'
import { useApp } from '@/context/AppContext'
import {
  getDefaultStatuses,
  getDefaultPriorities,
  MODULE_LABELS,
} from '@/lib/constants'
import { MODULE_DONE_STATUS } from '@/lib/constants'

interface ItemDetailModalProps {
  item: Item | null
  onClose: () => void
  onUpdated?: () => void
}

export function ItemDetailModal({ item, onClose, onUpdated }: ItemDetailModalProps) {
  const { updateItem, deleteItem, addComment, getCommentsForItem, online } = useApp()
  const [form, setForm] = useState<Partial<Item>>({})
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (item) setForm({ ...item, data: { ...item.data } })
  }, [item])

  if (!item) return null

  const comments = getCommentsForItem(item.id)
  const statuses = getDefaultStatuses(item.module)
  const priorities = getDefaultPriorities(item.module)
  const doneStatus = MODULE_DONE_STATUS[item.module]?.[0] ?? 'fait'

  const save = async (updates: Partial<Item> & { status?: string }) => {
    if (!online) { setError('Modification impossible hors ligne'); return }
    setSaving(true)
    setError(null)
    try {
      await updateItem(item.id, {
        title: updates.title ?? form.title,
        status: updates.status ?? form.status,
        priority: updates.priority ?? form.priority,
        category: updates.category ?? form.category,
        period: updates.period ?? form.period,
        due_date: updates.due_date ?? form.due_date,
        responsible: updates.responsible ?? form.responsible,
        notes: updates.notes ?? form.notes,
        data: updates.data ?? form.data,
      })
      onUpdated?.()
      if (updates.status) onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  const handleComment = async () => {
    if (!comment.trim() || !online) return
    try {
      await addComment(item.id, comment.trim())
      setComment('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur')
    }
  }

  const handleDelete = async () => {
    if (!online) return
    await deleteItem(item.id)
    onClose()
  }

  const renderModuleFields = () => {
    const d = form.data ?? {}
    const field = (label: string, key: string, type: 'text' | 'checkbox' | 'number' = 'text') => (
      <label key={key} className="block">
        <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
        {type === 'checkbox' ? (
          <input
            type="checkbox"
            checked={Boolean(d[key as keyof typeof d])}
            onChange={(e) => setForm({ ...form, data: { ...d, [key]: e.target.checked } })}
            className="h-4 w-4 rounded border-slate-300"
          />
        ) : (
          <input
            type={type}
            value={String(d[key as keyof typeof d] ?? '')}
            onChange={(e) =>
              setForm({
                ...form,
                data: { ...d, [key]: type === 'number' ? Number(e.target.value) : e.target.value },
              })
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        )}
      </label>
    )

    switch (item.module as ModuleType) {
      case 'cartons':
        return (
          <>
            {field('Pièce actuelle', 'piece_actuelle')}
            {field('Pièce d\'arrivée', 'piece_arrivee')}
            {field('Contenu', 'contenu')}
            {field('Transport', 'transport')}
            {field('Fragile', 'fragile', 'checkbox')}
            {field('À démonter', 'a_demonter', 'checkbox')}
          </>
        )
      case 'voitures':
        return (
          <>
            {field('Voiture', 'voiture')}
            {field('Sac / caisse', 'sac_caisse')}
            {field('Catégorie voiture', 'voiture')}
            {field('Indispensable', 'indispensable', 'checkbox')}
          </>
        )
      case 'documents':
        return (
          <>
            {field('Emplacement', 'emplacement')}
            {field('Version papier', 'version_papier', 'checkbox')}
            {field('Version numérique', 'version_numerique', 'checkbox')}
          </>
        )
      case 'contacts':
        return (
          <>
            {field('Personne', 'personne')}
            {field('Téléphone', 'telephone')}
            {field('Email', 'email')}
            {field('Rôle', 'role')}
            {field('Organisme', 'organisme')}
            {field('À contacter avant', 'a_contacter_avant')}
          </>
        )
      case 'demarches':
        return (
          <>
            {field('Organisme', 'organisme')}
            {field('Lien', 'lien')}
            {field('Identifiants / références', 'identifiants')}
            {field('Preuve conservée', 'preuve_conservee', 'checkbox')}
          </>
        )
      case 'budget':
        return (
          <>
            {field('Montant estimé', 'montant_estime', 'number')}
            {field('Montant réel', 'montant_reel', 'number')}
            {field('Payé', 'paye', 'checkbox')}
            {field('Justificatif conservé', 'justificatif_conserve', 'checkbox')}
            {field('Moyen de paiement', 'moyen_paiement')}
          </>
        )
      case 'verifications':
        return (
          <>
            {field('Jour', 'jour')}
            {field('Moment', 'moment')}
            {field('Lieu', 'lieu')}
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
      <div className="flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-xl sm:max-h-[90dvh] sm:rounded-2xl safe-bottom">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs text-slate-400">{MODULE_LABELS[item.module]}</p>
            <h2 className="font-bold text-slate-800">Détail</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <div className="flex flex-wrap gap-2">
            <button onClick={() => save({ status: doneStatus })} disabled={saving}
              className="touch-target flex items-center justify-center gap-1.5 rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 sm:py-2">
              <Check className="h-4 w-4" /> <span className="hidden sm:inline">Marquer comme fait</span><span className="sm:hidden">Fait</span>
            </button>
            <button onClick={() => save({ status: 'en_cours' })} disabled={saving}
              className="touch-target flex items-center justify-center gap-1.5 rounded-xl bg-blue-100 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-200 sm:py-2">
              <Play className="h-4 w-4" /> En cours
            </button>
            <button onClick={() => save({ status: 'bloque' })} disabled={saving}
              className="touch-target flex items-center justify-center gap-1.5 rounded-xl bg-red-100 px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-200 sm:py-2">
              <Ban className="h-4 w-4" /> Bloqué
            </button>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Titre</span>
            <input value={form.title ?? ''} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium" />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">Statut</span>
              <select value={form.status ?? ''} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">Priorité</span>
              <select value={form.priority ?? ''} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">Catégorie</span>
              <input value={form.category ?? ''} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">Responsable</span>
              <input value={form.responsible ?? ''} onChange={(e) => setForm({ ...form, responsible: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </label>
          </div>

          {item.module === 'echeancier' && (
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">Période</span>
              <input value={form.period ?? ''} onChange={(e) => setForm({ ...form, period: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </label>
          )}

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Date limite</span>
            <input type="date" value={form.due_date ?? ''} onChange={(e) => setForm({ ...form, due_date: e.target.value || null })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </label>

          {renderModuleFields()}

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Notes</span>
            <textarea value={form.notes ?? ''} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </label>

          <p className="text-xs text-slate-400">
            Modifié le {format(parseISO(item.updated_at), 'd MMM yyyy à HH:mm', { locale: fr })}
          </p>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-700">Commentaires</h3>
            <div className="mb-3 space-y-2">
              {comments.length === 0 && <p className="text-xs text-slate-400">Aucun commentaire</p>}
              {comments.map((c) => (
                <div key={c.id} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-sm text-slate-700">{c.content}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {c.author_name} — {format(parseISO(c.created_at), 'd MMM HH:mm', { locale: fr })}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={comment} onChange={(e) => setComment(e.target.value)}
                placeholder="Ajouter un commentaire…"
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleComment()} />
              <button onClick={handleComment} disabled={!online}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50">
                Envoyer
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-t border-slate-100 px-5 py-4">
          <button onClick={() => save({})} disabled={saving || !online}
            className="flex-1 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
            Enregistrer
          </button>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} disabled={!online}
              className="rounded-xl border border-red-200 p-3 text-red-600 hover:bg-red-50">
              <Trash2 className="h-5 w-5" />
            </button>
          ) : (
            <button onClick={handleDelete}
              className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white">
              Confirmer
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
