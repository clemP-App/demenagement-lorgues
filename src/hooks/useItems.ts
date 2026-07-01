import { useState, useEffect, useCallback } from 'react'
import type { Item, ItemInput } from '@/types'
import {
  fetchItems,
  getCachedItems,
  createItem,
  updateItem,
  deleteItem,
  bulkCreateItems,
} from '@/services/api'
import { saveItemsCache } from '@/lib/cache'

export function useItems(workspaceId: string | undefined, online: boolean) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (showLoading = true) => {
    if (!workspaceId) return
    if (showLoading) setLoading(true)
    try {
      if (online) {
        const data = await fetchItems(workspaceId)
        setItems(data)
        setError(null)
      } else {
        setItems(getCachedItems(workspaceId))
      }
    } catch (e) {
      setItems(getCachedItems(workspaceId))
      setError(e instanceof Error ? e.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
      setSyncing(false)
    }
  }, [workspaceId, online])

  useEffect(() => {
    if (workspaceId) {
      setItems(getCachedItems(workspaceId))
      load()
    }
  }, [workspaceId, load])

  const sync = async () => {
    if (!workspaceId || !online) return
    setSyncing(true)
    await load(false)
  }

  const add = async (input: ItemInput) => {
    if (!workspaceId) throw new Error('Pas d\'espace')
    if (!online) throw new Error('Modification impossible hors ligne')
    const item = await createItem(workspaceId, input)
    setItems((prev) => [...prev, item])
    return item
  }

  const update = async (itemId: string, updates: Partial<ItemInput> & { status?: string }) => {
    if (!workspaceId) throw new Error('Pas d\'espace')
    if (!online) throw new Error('Modification impossible hors ligne')
    const item = await updateItem(workspaceId, itemId, updates)
    setItems((prev) => prev.map((i) => (i.id === itemId ? item : i)))
    return item
  }

  const remove = async (itemId: string) => {
    if (!workspaceId) throw new Error('Pas d\'espace')
    if (!online) throw new Error('Modification impossible hors ligne')
    await deleteItem(workspaceId, itemId)
    setItems((prev) => prev.filter((i) => i.id !== itemId))
  }

  const bulkAdd = async (inputs: ItemInput[]) => {
    if (!workspaceId) throw new Error('Pas d\'espace')
    if (!online) throw new Error('Modification impossible hors ligne')
    await bulkCreateItems(workspaceId, inputs)
    await load(false)
  }

  const patchLocal = useCallback((item: Item) => {
    setItems((prev) => {
      const next = prev.map((i) => (i.id === item.id ? item : i))
      if (workspaceId) saveItemsCache(workspaceId, next)
      return next
    })
  }, [workspaceId])

  const addLocal = useCallback((item: Item) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id)
      const next = exists ? prev.map((i) => (i.id === item.id ? item : i)) : [...prev, item]
      if (workspaceId) saveItemsCache(workspaceId, next)
      return next
    })
  }, [workspaceId])

  const removeLocal = useCallback((itemId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== itemId)
      if (workspaceId) saveItemsCache(workspaceId, next)
      return next
    })
  }, [workspaceId])

  return {
    items,
    loading,
    syncing,
    error,
    load,
    sync,
    add,
    update,
    remove,
    bulkAdd,
    patchLocal,
    addLocal,
    removeLocal,
    setItems,
  }
}
