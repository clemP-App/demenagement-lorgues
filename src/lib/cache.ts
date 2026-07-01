import type { Item, Comment, ActivityLog, Workspace } from '@/types'

const CACHE_PREFIX = 'demenagement-lorgues:'

export const cacheKeys = {
  workspace: `${CACHE_PREFIX}workspace`,
  items: (wsId: string) => `${CACHE_PREFIX}items:${wsId}`,
  comments: (wsId: string) => `${CACHE_PREFIX}comments:${wsId}`,
  activity: (wsId: string) => `${CACHE_PREFIX}activity:${wsId}`,
  displayName: `${CACHE_PREFIX}display-name`,
  lastSync: (wsId: string) => `${CACHE_PREFIX}last-sync:${wsId}`,
}

export function saveToCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // quota exceeded — ignore
  }
}

export function loadFromCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function clearWorkspaceCache(wsId: string): void {
  localStorage.removeItem(cacheKeys.items(wsId))
  localStorage.removeItem(cacheKeys.comments(wsId))
  localStorage.removeItem(cacheKeys.activity(wsId))
  localStorage.removeItem(cacheKeys.lastSync(wsId))
}

export function saveWorkspaceCache(workspace: Workspace): void {
  saveToCache(cacheKeys.workspace, workspace)
}

export function loadWorkspaceCache(): Workspace | null {
  return loadFromCache<Workspace>(cacheKeys.workspace)
}

export function clearWorkspaceMeta(): void {
  localStorage.removeItem(cacheKeys.workspace)
}

export function saveItemsCache(wsId: string, items: Item[]): void {
  saveToCache(cacheKeys.items(wsId), items)
  saveToCache(cacheKeys.lastSync(wsId), new Date().toISOString())
}

export function loadItemsCache(wsId: string): Item[] {
  return loadFromCache<Item[]>(cacheKeys.items(wsId)) ?? []
}

export function saveCommentsCache(wsId: string, comments: Comment[]): void {
  saveToCache(cacheKeys.comments(wsId), comments)
}

export function loadCommentsCache(wsId: string): Comment[] {
  return loadFromCache<Comment[]>(cacheKeys.comments(wsId)) ?? []
}

export function saveActivityCache(wsId: string, activity: ActivityLog[]): void {
  saveToCache(cacheKeys.activity(wsId), activity)
}

export function loadActivityCache(wsId: string): ActivityLog[] {
  return loadFromCache<ActivityLog[]>(cacheKeys.activity(wsId)) ?? []
}

export function getDisplayName(): string {
  return localStorage.getItem(cacheKeys.displayName) ?? ''
}

export function setDisplayName(name: string): void {
  localStorage.setItem(cacheKeys.displayName, name)
}
