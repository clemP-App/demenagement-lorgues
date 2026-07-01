import { useState, useEffect, useCallback } from 'react'
import type { Comment } from '@/types'
import {
  fetchComments,
  getCachedComments,
  addComment,
} from '@/services/api'

export function useComments(workspaceId: string | undefined, online: boolean) {
  const [comments, setComments] = useState<Comment[]>([])

  const load = useCallback(async () => {
    if (!workspaceId) return
    try {
      if (online) {
        const data = await fetchComments(workspaceId)
        setComments(data)
      } else {
        setComments(getCachedComments(workspaceId))
      }
    } catch {
      setComments(getCachedComments(workspaceId))
    }
  }, [workspaceId, online])

  useEffect(() => {
    if (workspaceId) {
      setComments(getCachedComments(workspaceId))
      load()
    }
  }, [workspaceId, load])

  const add = async (itemId: string, content: string) => {
    if (!workspaceId) throw new Error('Pas d\'espace')
    if (!online) throw new Error('Modification impossible hors ligne')
    const comment = await addComment(workspaceId, itemId, content)
    setComments((prev) => [comment, ...prev])
    return comment
  }

  const addLocal = (comment: Comment) => {
    setComments((prev) => {
      if (prev.some((c) => c.id === comment.id)) return prev
      return [comment, ...prev]
    })
  }

  const getForItem = (itemId: string) =>
    comments.filter((c) => c.item_id === itemId).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )

  return { comments, load, add, addLocal, getForItem }
}
