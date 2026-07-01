import { supabase, ensureAnonymousAuth } from '@/lib/supabase'
import { normalizeInviteCode } from '@/lib/utils'
import type { Workspace, Item, ItemInput, Comment, ActivityLog } from '@/types'
import {
  saveWorkspaceCache,
  saveItemsCache,
  loadItemsCache,
  saveCommentsCache,
  loadCommentsCache,
  saveActivityCache,
  loadActivityCache,
  getDisplayName,
} from '@/lib/cache'

export async function fetchWorkspace(): Promise<Workspace | null> {
  const { data, error } = await supabase.rpc('get_my_workspace')
  if (error) throw error
  const row = data?.[0]
  if (!row) return null
  const workspace: Workspace = row
  saveWorkspaceCache(workspace)
  return workspace
}

export async function createWorkspace(
  name: string,
  inviteCode: string,
  displayName: string,
): Promise<string> {
  await ensureAnonymousAuth()
  const { data, error } = await supabase.rpc('create_workspace_with_member', {
    workspace_name: name,
    invite_code: normalizeInviteCode(inviteCode),
    display_name: displayName,
  })
  if (error) throw error
  return data as string
}

export async function joinWorkspace(
  inviteCode: string,
  displayName: string,
): Promise<string> {
  await ensureAnonymousAuth()
  const { data, error } = await supabase.rpc('join_workspace_by_code', {
    invite_code: normalizeInviteCode(inviteCode),
    display_name: displayName,
  })
  if (error) throw error
  return data as string
}

export async function updateMemberDisplayName(
  workspaceId: string,
  displayName: string,
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  const { error } = await supabase
    .from('workspace_members')
    .update({ display_name: displayName })
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
  if (error) throw error
}

export async function fetchItems(workspaceId: string): Promise<Item[]> {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('sort_order')
    .order('created_at')
  if (error) throw error
  const items = (data ?? []) as Item[]
  saveItemsCache(workspaceId, items)
  return items
}

export function getCachedItems(workspaceId: string): Item[] {
  return loadItemsCache(workspaceId)
}

export async function createItem(
  workspaceId: string,
  input: ItemInput,
): Promise<Item> {
  const userId = await ensureAnonymousAuth()
  const displayName = getDisplayName() || 'Membre'
  const { data, error } = await supabase
    .from('items')
    .insert({
      workspace_id: workspaceId,
      module: input.module,
      title: input.title,
      status: input.status ?? 'a_faire',
      priority: input.priority ?? 'moyenne',
      category: input.category ?? null,
      period: input.period ?? null,
      due_date: input.due_date ?? null,
      responsible: input.responsible ?? null,
      notes: input.notes ?? null,
      data: input.data ?? {},
      sort_order: input.sort_order ?? 0,
      created_by: userId,
      updated_by: userId,
    })
    .select()
    .single()
  if (error) throw error

  await logActivity(workspaceId, data.id, 'create', null, { title: input.title, module: input.module }, displayName)
  return data as Item
}

export async function updateItem(
  workspaceId: string,
  itemId: string,
  updates: Partial<ItemInput> & { status?: string },
): Promise<Item> {
  const userId = await ensureAnonymousAuth()
  const displayName = getDisplayName() || 'Membre'
  const { data, error } = await supabase
    .from('items')
    .update({
      ...updates,
      updated_by: userId,
    })
    .eq('id', itemId)
    .eq('workspace_id', workspaceId)
    .select()
    .single()
  if (error) throw error

  if (updates.status) {
    await logActivity(
      workspaceId,
      itemId,
      'status_change',
      null,
      { status: updates.status, title: data.title, module: data.module },
      displayName,
    )
  }
  return data as Item
}

export async function deleteItem(workspaceId: string, itemId: string): Promise<void> {
  const displayName = getDisplayName() || 'Membre'
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', itemId)
    .eq('workspace_id', workspaceId)
  if (error) throw error
  await logActivity(workspaceId, itemId, 'delete', null, null, displayName)
}

export async function bulkCreateItems(
  workspaceId: string,
  inputs: ItemInput[],
): Promise<void> {
  const userId = await ensureAnonymousAuth()
  const rows = inputs.map((input, i) => ({
    workspace_id: workspaceId,
    module: input.module,
    title: input.title,
    status: input.status ?? 'a_faire',
    priority: input.priority ?? 'moyenne',
    category: input.category ?? null,
    period: input.period ?? null,
    due_date: input.due_date ?? null,
    responsible: input.responsible ?? null,
    notes: input.notes ?? null,
    data: input.data ?? {},
    sort_order: input.sort_order ?? i,
    created_by: userId,
    updated_by: userId,
  }))
  const { error } = await supabase.from('items').insert(rows)
  if (error) throw error
}

export async function fetchComments(workspaceId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
  if (error) throw error
  const comments = (data ?? []) as Comment[]
  saveCommentsCache(workspaceId, comments)
  return comments
}

export async function addComment(
  workspaceId: string,
  itemId: string,
  content: string,
): Promise<Comment> {
  const userId = await ensureAnonymousAuth()
  const displayName = getDisplayName() || 'Membre'
  const { data, error } = await supabase
    .from('comments')
    .insert({
      workspace_id: workspaceId,
      item_id: itemId,
      author_id: userId,
      author_name: displayName,
      content,
    })
    .select()
    .single()
  if (error) throw error
  return data as Comment
}

export async function fetchActivity(workspaceId: string): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw error
  const activity = (data ?? []) as ActivityLog[]
  saveActivityCache(workspaceId, activity)
  return activity
}

async function logActivity(
  workspaceId: string,
  itemId: string | null,
  action: string,
  oldValue: Record<string, unknown> | null,
  newValue: Record<string, unknown> | null,
  authorName: string,
): Promise<void> {
  try {
    const userId = await ensureAnonymousAuth()
    await supabase.from('activity_log').insert({
      workspace_id: workspaceId,
      item_id: itemId,
      action,
      old_value: oldValue,
      new_value: newValue,
      author_id: userId,
      author_name: authorName,
    })
  } catch {
    // Ne pas bloquer l'action principale si le journal échoue
  }
}

export async function updateSeedVersion(workspaceId: string, version: number): Promise<void> {
  const { error } = await supabase.rpc('update_seed_version', {
    ws_id: workspaceId,
    version,
  })
  if (error) throw error
}

export async function resetWorkspaceData(workspaceId: string): Promise<void> {
  const { error } = await supabase.rpc('reset_workspace_data', { ws_id: workspaceId })
  if (error) throw error
}

export function getCachedComments(workspaceId: string): Comment[] {
  return loadCommentsCache(workspaceId)
}

export function getCachedActivity(workspaceId: string): ActivityLog[] {
  return loadActivityCache(workspaceId)
}
