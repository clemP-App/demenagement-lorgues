import { useState, useRef } from 'react'
import { Copy, Download, Upload, RefreshCw, Database, Trash2, Check } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { SEED_ITEMS } from '@/data/seed'
import { CURRENT_SEED_VERSION } from '@/types'
import { updateSeedVersion, resetWorkspaceData } from '@/services/api'
import { downloadFile, exportToCsv } from '@/lib/utils'
import { clearWorkspaceCache } from '@/lib/cache'

import { PageShell } from '@/components/PageShell'

export function SettingsPage() {
  const {
    workspace, displayName, updateDisplayName, syncItems, items, online, bulkAddItems,
  } = useApp()
  const [name, setName] = useState(displayName)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!workspace) return null

  const copyCode = async () => {
    await navigator.clipboard.writeText(workspace.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const loadSeed = async () => {
    if (!online) { setMessage('Impossible hors ligne'); return }
    if (workspace.seed_version >= CURRENT_SEED_VERSION) {
      setMessage('Le modèle complet est déjà chargé.')
      return
    }
    setLoading(true)
    try {
      await bulkAddItems(SEED_ITEMS)
      await updateSeedVersion(workspace.id, CURRENT_SEED_VERSION)
      await syncItems()
      setMessage('Modèle complet chargé avec succès !')
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  const exportJson = () => {
    const data = { workspace, items, exportedAt: new Date().toISOString() }
    downloadFile(JSON.stringify(data, null, 2), 'demenagement-lorgues-export.json', 'application/json')
  }

  const exportTasksCsv = () => {
    const tasks = items.filter((i) => i.module === 'echeancier')
    downloadFile(exportToCsv(tasks, ['title', 'status', 'priority', 'category', 'period', 'due_date', 'responsible']), 'taches.csv', 'text/csv')
  }

  const exportCartonsCsv = () => {
    const cartons = items.filter((i) => i.module === 'cartons')
    downloadFile(exportToCsv(cartons, ['title', 'status', 'priority', 'piece_actuelle', 'piece_arrivee', 'transport', 'contenu']), 'cartons.csv', 'text/csv')
  }

  const exportDemarchesCsv = () => {
    const demarches = items.filter((i) => i.module === 'demarches')
    downloadFile(exportToCsv(demarches, ['title', 'status', 'priority', 'category', 'organisme']), 'demarches.csv', 'text/csv')
  }

  const importJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !online) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      if (data.items?.length) {
        await bulkAddItems(data.items)
        await syncItems()
        setMessage(`${data.items.length} éléments importés`)
      }
    } catch {
      setMessage('Fichier JSON invalide')
    }
  }

  const handleReset = async () => {
    if (!online) return
    setLoading(true)
    try {
      await resetWorkspaceData(workspace.id)
      clearWorkspaceCache(workspace.id)
      await syncItems()
      setMessage('Données réinitialisées')
      setConfirmReset(false)
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  const saveName = async () => {
    if (name.trim()) await updateDisplayName(name.trim())
  }

  return (
    <PageShell size="sm">
      <h1 className="text-2xl font-bold text-slate-800">Paramètres</h1>

      {message && (
        <div className="mt-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">{message}</div>
      )}

      <div className="mt-6 space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-800">Espace familial</h2>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs text-slate-500">Nom de l'espace</p>
              <p className="font-medium">{workspace.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Code d'invitation</p>
              <div className="flex items-center gap-2">
                <code className="rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-sm">{workspace.invite_code}</code>
                <button onClick={copyCode} className="flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-sm text-brand-700">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copié' : 'Copier'}
                </button>
              </div>
            </div>
            <label className="block">
              <p className="text-xs text-slate-500">Votre nom affiché</p>
              <div className="mt-1 flex gap-2">
                <input value={name} onChange={(e) => setName(e.target.value)}
                  className="flex-1 rounded-lg border px-3 py-2 text-sm" />
                <button onClick={saveName} className="rounded-lg bg-brand-600 px-4 py-2 text-sm text-white">
                  OK
                </button>
              </div>
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
          <h2 className="font-semibold text-slate-800">Données</h2>
          <SettingButton icon={RefreshCw} label="Recharger les données" onClick={() => syncItems()} disabled={!online} />
          <SettingButton icon={Database} label="Charger le modèle complet du déménagement" onClick={loadSeed} disabled={!online || loading} />
          <SettingButton icon={Download} label="Exporter JSON complet" onClick={exportJson} />
          <SettingButton icon={Download} label="Exporter CSV des tâches" onClick={exportTasksCsv} />
          <SettingButton icon={Download} label="Exporter CSV des cartons" onClick={exportCartonsCsv} />
          <SettingButton icon={Download} label="Exporter CSV des démarches" onClick={exportDemarchesCsv} />
          <SettingButton icon={Upload} label="Importer un JSON" onClick={() => fileRef.current?.click()} disabled={!online} />
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={importJson} />
        </section>

        <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <h2 className="font-semibold text-red-800">Zone dangereuse</h2>
          {!confirmReset ? (
            <button onClick={() => setConfirmReset(true)} disabled={!online}
              className="mt-3 flex w-full items-center gap-3 rounded-xl border border-red-300 bg-white p-4 text-red-700">
              <Trash2 className="h-5 w-5" />
              Réinitialiser toutes les données
            </button>
          ) : (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-red-700">Cette action est irréversible. Confirmer ?</p>
              <button onClick={handleReset} disabled={loading}
                className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white">
                Oui, tout supprimer
              </button>
              <button onClick={() => setConfirmReset(false)}
                className="w-full rounded-xl border py-3 text-sm">
                Annuler
              </button>
            </div>
          )}
        </section>

        <p className="text-xs text-slate-400 text-center">
          Évite de stocker des documents sensibles ou des informations confidentielles dans les notes.
        </p>
      </div>
    </PageShell>
  )
}

function SettingButton({
  icon: Icon, label, onClick, disabled,
}: {
  icon: typeof Copy; label: string; onClick: () => void; disabled?: boolean
}) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left hover:bg-slate-50 disabled:opacity-50">
      <Icon className="h-5 w-5 text-slate-500" />
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </button>
  )
}
