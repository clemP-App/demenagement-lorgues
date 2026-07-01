import { useState } from 'react'
import { Home, Users, Loader2 } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { generateInviteCode, formatSupabaseError } from '@/lib/utils'

export function WelcomeScreen() {
  const { createWorkspace, joinWorkspace, workspaceLoading, workspaceError } = useApp()
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose')
  const [name, setName] = useState('Déménagement Lorgues')
  const [inviteCode, setInviteCode] = useState(generateInviteCode())
  const [displayName, setDisplayName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!displayName.trim()) { setError('Indiquez votre prénom'); return }
    setLoading(true)
    setError(null)
    try {
      await createWorkspace(name, inviteCode, displayName.trim())
    } catch (err) {
      setError(formatSupabaseError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!displayName.trim() || !joinCode.trim()) {
      setError('Remplissez tous les champs')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await joinWorkspace(joinCode.trim(), displayName.trim())
    } catch (err) {
      setError(formatSupabaseError(err))
    } finally {
      setLoading(false)
    }
  }

  if (workspaceLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-3xl shadow-lg shadow-brand-200">
            📦
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Déménagement Lorgues</h1>
          <p className="mt-2 text-sm text-slate-500">
            Départ le 29 juillet — État des lieux le 30 juillet
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
          {(error || workspaceError) && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error || workspaceError}</p>
          )}

          {mode === 'choose' && (
            <div className="space-y-3">
              <button
                onClick={() => setMode('create')}
                className="flex w-full items-center gap-4 rounded-xl border-2 border-brand-200 bg-brand-50 p-4 text-left transition-colors hover:border-brand-400"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Créer mon espace déménagement</p>
                  <p className="text-xs text-slate-500">Premier appareil de la famille</p>
                </div>
              </button>
              <button
                onClick={() => setMode('join')}
                className="flex w-full items-center gap-4 rounded-xl border-2 border-slate-200 p-4 text-left transition-colors hover:border-slate-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Rejoindre un espace existant</p>
                  <p className="text-xs text-slate-500">Avec le code d'invitation</p>
                </div>
              </button>
            </div>
          )}

          {mode === 'create' && (
            <form onSubmit={handleCreate} className="space-y-4">
              <button type="button" onClick={() => setMode('choose')} className="text-sm text-brand-600">
                ← Retour
              </button>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Votre prénom</span>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ex : Clément"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-base sm:py-3 sm:text-sm" required />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Nom de l'espace</span>
                <input value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-base sm:py-3 sm:text-sm" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Code d'invitation</span>
                <input value={inviteCode} onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 font-mono text-base uppercase sm:py-3 sm:text-sm" />
                <p className="mt-1 text-xs text-slate-400">
                  Partagez ce code exact avec votre conjoint(e) — utilisez le bouton Copier dans Paramètres
                </p>
              </label>
              <button type="submit" disabled={loading}
                className="touch-target w-full rounded-xl bg-brand-600 py-4 text-base font-semibold text-white hover:bg-brand-700 disabled:opacity-50 sm:py-3.5 sm:text-sm">
                {loading ? 'Création…' : 'Créer l\'espace'}
              </button>
            </form>
          )}

          {mode === 'join' && (
            <form onSubmit={handleJoin} className="space-y-4">
              <button type="button" onClick={() => setMode('choose')} className="text-sm text-brand-600">
                ← Retour
              </button>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Votre prénom</span>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ex : Julie"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-base sm:py-3 sm:text-sm" required />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Code d'invitation</span>
                <input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="LORGUES-2026"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm uppercase" required />
              </label>
              <button type="submit" disabled={loading}
                className="touch-target w-full rounded-xl bg-brand-600 py-4 text-base font-semibold text-white hover:bg-brand-700 disabled:opacity-50 sm:py-3.5 sm:text-sm">
                {loading ? 'Connexion…' : 'Rejoindre l\'espace'}
              </button>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Évite de stocker des documents sensibles ou des informations confidentielles dans les notes.
        </p>
      </div>
    </div>
  )
}
