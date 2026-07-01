import { useState, useEffect } from 'react'
import type { ActivityLog } from '@/types'
import { fetchActivity, getCachedActivity } from '@/services/api'

export function useActivity(workspaceId: string | undefined, online: boolean) {
  const [activity, setActivity] = useState<ActivityLog[]>([])

  useEffect(() => {
    if (!workspaceId) return
    setActivity(getCachedActivity(workspaceId))
    if (online) {
      fetchActivity(workspaceId)
        .then(setActivity)
        .catch(() => setActivity(getCachedActivity(workspaceId)))
    }
  }, [workspaceId, online])

  const addLocal = (log: ActivityLog) => {
    setActivity((prev) => {
      if (prev.some((a) => a.id === log.id)) return prev
      return [log, ...prev].slice(0, 100)
    })
  }

  const refresh = async () => {
    if (!workspaceId || !online) return
    const data = await fetchActivity(workspaceId)
    setActivity(data)
  }

  return { activity, addLocal, refresh }
}
