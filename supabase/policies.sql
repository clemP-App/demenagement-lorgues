-- Déménagement Lorgues — Row Level Security

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Helper: vérifier l'appartenance au workspace
CREATE OR REPLACE FUNCTION is_workspace_member(ws_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = ws_id AND user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- WORKSPACES
DROP POLICY IF EXISTS "workspaces_select" ON workspaces;
CREATE POLICY "workspaces_select" ON workspaces
  FOR SELECT USING (is_workspace_member(id));

DROP POLICY IF EXISTS "workspaces_update" ON workspaces;
CREATE POLICY "workspaces_update" ON workspaces
  FOR UPDATE USING (is_workspace_member(id));

-- Pas d'INSERT/DELETE direct sur workspaces (via fonctions RPC)

-- WORKSPACE_MEMBERS
DROP POLICY IF EXISTS "members_select" ON workspace_members;
CREATE POLICY "members_select" ON workspace_members
  FOR SELECT USING (is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "members_update_self" ON workspace_members;
CREATE POLICY "members_update_self" ON workspace_members
  FOR UPDATE USING (user_id = auth.uid());

-- ITEMS
DROP POLICY IF EXISTS "items_select" ON items;
CREATE POLICY "items_select" ON items
  FOR SELECT USING (is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "items_insert" ON items;
CREATE POLICY "items_insert" ON items
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "items_update" ON items;
CREATE POLICY "items_update" ON items
  FOR UPDATE USING (is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "items_delete" ON items;
CREATE POLICY "items_delete" ON items
  FOR DELETE USING (is_workspace_member(workspace_id));

-- COMMENTS
DROP POLICY IF EXISTS "comments_select" ON comments;
CREATE POLICY "comments_select" ON comments
  FOR SELECT USING (is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "comments_insert" ON comments;
CREATE POLICY "comments_insert" ON comments
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "comments_delete" ON comments;
CREATE POLICY "comments_delete" ON comments
  FOR DELETE USING (is_workspace_member(workspace_id) AND author_id = auth.uid());

-- ACTIVITY_LOG
DROP POLICY IF EXISTS "activity_select" ON activity_log;
CREATE POLICY "activity_select" ON activity_log
  FOR SELECT USING (is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "activity_insert" ON activity_log;
CREATE POLICY "activity_insert" ON activity_log
  FOR INSERT WITH CHECK (is_workspace_member(workspace_id));
