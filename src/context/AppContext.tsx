import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useWorkspace } from '@/hooks/useWorkspace'
import { useItems } from '@/hooks/useItems'
import { useComments } from '@/hooks/useComments'
import { useActivity } from '@/hooks/useActivity'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { useRealtime } from '@/hooks/useRealtime'
import type { Item, ItemInput, Workspace } from '@/types'

interface AppContextValue {
  workspace: Workspace | null
  workspaceLoading: boolean
  workspaceError: string | null
  displayName: string
  online: boolean
  items: Item[]
  itemsLoading: boolean
  itemsSyncing: boolean
  createWorkspace: (name: string, code: string, displayName: string) => Promise<Workspace | null>
  joinWorkspace: (code: string, displayName: string) => Promise<Workspace | null>
  updateDisplayName: (name: string) => Promise<void>
  refreshWorkspace: () => Promise<Workspace | null>
  syncItems: () => Promise<void>
  addItem: (input: ItemInput) => Promise<Item>
  updateItem: (id: string, updates: Partial<ItemInput> & { status?: string }) => Promise<Item>
  deleteItem: (id: string) => Promise<void>
  bulkAddItems: (inputs: ItemInput[]) => Promise<void>
  addComment: (itemId: string, content: string) => Promise<void>
  getCommentsForItem: (itemId: string) => ReturnType<typeof useComments>['getForItem'] extends (id: string) => infer R ? R : never
  activity: ReturnType<typeof useActivity>['activity']
  refreshActivity: () => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const online = useOnlineStatus()
  const ws = useWorkspace()
  const itemsHook = useItems(ws.workspace?.id, online)
  const commentsHook = useComments(ws.workspace?.id, online)
  const activityHook = useActivity(ws.workspace?.id, online)

  const realtimeCallbacks = useMemo(
    () => ({
      onItemInsert: itemsHook.addLocal,
      onItemUpdate: itemsHook.patchLocal,
      onItemDelete: itemsHook.removeLocal,
      onCommentInsert: commentsHook.addLocal,
      onActivityInsert: activityHook.addLocal,
    }),
    [itemsHook.addLocal, itemsHook.patchLocal, itemsHook.removeLocal, commentsHook.addLocal, activityHook.addLocal],
  )

  useRealtime(ws.workspace?.id, realtimeCallbacks)

  const value = useMemo<AppContextValue>(
    () => ({
      workspace: ws.workspace,
      workspaceLoading: ws.loading,
      workspaceError: ws.error,
      displayName: ws.displayName,
      online,
      items: itemsHook.items,
      itemsLoading: itemsHook.loading,
      itemsSyncing: itemsHook.syncing,
      createWorkspace: ws.createWorkspace,
      joinWorkspace: ws.joinWorkspace,
      updateDisplayName: ws.updateDisplayName,
      refreshWorkspace: ws.refresh,
      syncItems: itemsHook.sync,
      addItem: itemsHook.add,
      updateItem: itemsHook.update,
      deleteItem: itemsHook.remove,
      bulkAddItems: itemsHook.bulkAdd,
      addComment: async (itemId, content) => {
        await commentsHook.add(itemId, content)
      },
      getCommentsForItem: commentsHook.getForItem,
      activity: activityHook.activity,
      refreshActivity: activityHook.refresh,
    }),
    [ws, online, itemsHook, commentsHook, activityHook],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
