import { useState, useEffect, useCallback } from 'react'
import { ensureAnonymousAuth, isSupabaseConfigured } from '@/lib/supabase'
import {
  fetchWorkspace,
  createWorkspace,
  joinWorkspace,
  updateMemberDisplayName,
} from '@/services/api'
import {
  getDisplayName,
  setDisplayName,
  loadWorkspaceCache,
} from '@/lib/cache'
import type { Workspace } from '@/types'
import { generateInviteCode } from '@/lib/utils'

export function useWorkspace() {
  const [workspace, setWorkspace] = useState<Workspace | null>(loadWorkspaceCache())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authReady, setAuthReady] = useState(false)

  const init = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError('Supabase non configuré. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env')
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      await ensureAnonymousAuth()
      setAuthReady(true)
      const ws = await fetchWorkspace()
      setWorkspace(ws)
    } catch (e) {
      const cached = loadWorkspaceCache()
      if (cached) setWorkspace(cached)
      setError(e instanceof Error ? e.message : 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    init()
  }, [init])

  const handleCreate = async (name: string, inviteCode: string, displayName: string) => {
    setDisplayName(displayName)
    const code = inviteCode || generateInviteCode()
    await createWorkspace(name, code, displayName)
    const ws = await fetchWorkspace()
    setWorkspace(ws)
    return ws
  }

  const handleJoin = async (inviteCode: string, displayName: string) => {
    setDisplayName(displayName)
    await joinWorkspace(inviteCode, displayName)
    const ws = await fetchWorkspace()
    setWorkspace(ws)
    return ws
  }

  const handleUpdateDisplayName = async (name: string) => {
    if (!workspace) return
    setDisplayName(name)
    await updateMemberDisplayName(workspace.id, name)
    const ws = await fetchWorkspace()
    setWorkspace(ws)
  }

  const refresh = async () => {
    const ws = await fetchWorkspace()
    setWorkspace(ws)
    return ws
  }

  return {
    workspace,
    loading,
    error,
    authReady,
    displayName: getDisplayName() || workspace?.display_name || '',
    createWorkspace: handleCreate,
    joinWorkspace: handleJoin,
    updateDisplayName: handleUpdateDisplayName,
    refresh,
    setWorkspace,
  }
}
