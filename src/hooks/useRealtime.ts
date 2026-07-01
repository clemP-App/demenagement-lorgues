import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Item, Comment, ActivityLog } from '@/types'

interface RealtimeCallbacks {
  onItemInsert?: (item: Item) => void
  onItemUpdate?: (item: Item) => void
  onItemDelete?: (id: string) => void
  onCommentInsert?: (comment: Comment) => void
  onActivityInsert?: (log: ActivityLog) => void
}

export function useRealtime(workspaceId: string | undefined, callbacks: RealtimeCallbacks) {
  useEffect(() => {
    if (!workspaceId) return

    const channel = supabase
      .channel(`workspace:${workspaceId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'items', filter: `workspace_id=eq.${workspaceId}` },
        (payload) => callbacks.onItemInsert?.(payload.new as Item),
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'items', filter: `workspace_id=eq.${workspaceId}` },
        (payload) => callbacks.onItemUpdate?.(payload.new as Item),
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'items', filter: `workspace_id=eq.${workspaceId}` },
        (payload) => callbacks.onItemDelete?.((payload.old as Item).id),
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `workspace_id=eq.${workspaceId}` },
        (payload) => callbacks.onCommentInsert?.(payload.new as Comment),
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_log', filter: `workspace_id=eq.${workspaceId}` },
        (payload) => callbacks.onActivityInsert?.(payload.new as ActivityLog),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, callbacks])
}
