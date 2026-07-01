-- Correctif immédiat : exécuter ce fichier dans Supabase SQL Editor
-- Corrige : column reference "invite_code" is ambiguous

CREATE OR REPLACE FUNCTION join_workspace_by_code(
  invite_code TEXT,
  display_name TEXT DEFAULT 'Membre'
)
RETURNS UUID AS $$
DECLARE
  ws_id UUID;
  normalized_code TEXT;
  v_invite_code TEXT := invite_code;
  v_display_name TEXT := display_name;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  normalized_code := upper(trim(v_invite_code));

  SELECT w.id INTO ws_id
  FROM workspaces AS w
  WHERE w.invite_code = normalized_code;

  IF ws_id IS NULL THEN
    RAISE EXCEPTION 'Code d''invitation invalide';
  END IF;

  INSERT INTO workspace_members (workspace_id, user_id, display_name, role)
  VALUES (
    ws_id,
    auth.uid(),
    coalesce(nullif(trim(v_display_name), ''), 'Membre'),
    'member'
  )
  ON CONFLICT (workspace_id, user_id) DO UPDATE
    SET display_name = coalesce(
      nullif(trim(v_display_name), ''),
      workspace_members.display_name
    );

  RETURN ws_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION create_workspace_with_member(
  workspace_name TEXT,
  invite_code TEXT,
  display_name TEXT DEFAULT 'Membre'
)
RETURNS UUID AS $$
DECLARE
  new_workspace_id UUID;
  normalized_code TEXT;
  v_invite_code TEXT := invite_code;
  v_workspace_name TEXT := workspace_name;
  v_display_name TEXT := display_name;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  normalized_code := upper(trim(v_invite_code));

  IF length(normalized_code) < 4 THEN
    RAISE EXCEPTION 'Code d''invitation trop court';
  END IF;

  INSERT INTO workspaces (name, invite_code)
  VALUES (trim(v_workspace_name), normalized_code)
  RETURNING id INTO new_workspace_id;

  INSERT INTO workspace_members (workspace_id, user_id, display_name, role)
  VALUES (
    new_workspace_id,
    auth.uid(),
    coalesce(nullif(trim(v_display_name), ''), 'Membre'),
    'owner'
  );

  RETURN new_workspace_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
