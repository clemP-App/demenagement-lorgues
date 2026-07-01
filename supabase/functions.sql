-- Déménagement Lorgues — Fonctions RPC sécurisées

-- Créer un workspace et ajouter l'utilisateur courant comme owner
CREATE OR REPLACE FUNCTION create_workspace_with_member(
  workspace_name TEXT,
  invite_code TEXT,
  display_name TEXT DEFAULT 'Membre'
)
RETURNS UUID AS $$
DECLARE
  new_workspace_id UUID;
  normalized_code TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  normalized_code := upper(trim(invite_code));

  IF length(normalized_code) < 4 THEN
    RAISE EXCEPTION 'Code d''invitation trop court';
  END IF;

  INSERT INTO workspaces (name, invite_code)
  VALUES (trim(workspace_name), normalized_code)
  RETURNING id INTO new_workspace_id;

  INSERT INTO workspace_members (workspace_id, user_id, display_name, role)
  VALUES (new_workspace_id, auth.uid(), coalesce(nullif(trim(display_name), ''), 'Membre'), 'owner');

  RETURN new_workspace_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Rejoindre un workspace via code d'invitation
CREATE OR REPLACE FUNCTION join_workspace_by_code(
  invite_code TEXT,
  display_name TEXT DEFAULT 'Membre'
)
RETURNS UUID AS $$
DECLARE
  ws_id UUID;
  normalized_code TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  normalized_code := upper(trim(invite_code));

  SELECT id INTO ws_id
  FROM workspaces
  WHERE invite_code = normalized_code;

  IF ws_id IS NULL THEN
    RAISE EXCEPTION 'Code d''invitation invalide';
  END IF;

  INSERT INTO workspace_members (workspace_id, user_id, display_name, role)
  VALUES (ws_id, auth.uid(), coalesce(nullif(trim(display_name), ''), 'Membre'), 'member')
  ON CONFLICT (workspace_id, user_id) DO UPDATE
    SET display_name = coalesce(nullif(trim(display_name), ''), workspace_members.display_name);

  RETURN ws_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Récupérer le workspace de l'utilisateur (le plus récent)
CREATE OR REPLACE FUNCTION get_my_workspace()
RETURNS TABLE (
  id UUID,
  name TEXT,
  invite_code TEXT,
  seed_version INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  display_name TEXT,
  role TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT w.id, w.name, w.invite_code, w.seed_version, w.created_at, w.updated_at,
         wm.display_name, wm.role
  FROM workspace_members wm
  JOIN workspaces w ON w.id = wm.workspace_id
  WHERE wm.user_id = auth.uid()
  ORDER BY wm.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Mettre à jour seed_version
CREATE OR REPLACE FUNCTION update_seed_version(ws_id UUID, version INTEGER)
RETURNS VOID AS $$
BEGIN
  IF NOT is_workspace_member(ws_id) THEN
    RAISE EXCEPTION 'Accès refusé';
  END IF;
  UPDATE workspaces SET seed_version = version WHERE id = ws_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Réinitialiser toutes les données d'un workspace
CREATE OR REPLACE FUNCTION reset_workspace_data(ws_id UUID)
RETURNS VOID AS $$
BEGIN
  IF NOT is_workspace_member(ws_id) THEN
    RAISE EXCEPTION 'Accès refusé';
  END IF;
  DELETE FROM activity_log WHERE workspace_id = ws_id;
  DELETE FROM comments WHERE workspace_id = ws_id;
  DELETE FROM items WHERE workspace_id = ws_id;
  UPDATE workspaces SET seed_version = 0 WHERE id = ws_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Permissions d'exécution pour les utilisateurs authentifiés
GRANT EXECUTE ON FUNCTION create_workspace_with_member TO authenticated;
GRANT EXECUTE ON FUNCTION join_workspace_by_code TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_workspace TO authenticated;
GRANT EXECUTE ON FUNCTION update_seed_version TO authenticated;
GRANT EXECUTE ON FUNCTION reset_workspace_data TO authenticated;
