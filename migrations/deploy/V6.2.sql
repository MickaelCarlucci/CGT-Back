CREATE OR REPLACE FUNCTION assign_superadmin_role() 
RETURNS TRIGGER AS $$
BEGIN
    -- Vérifier si aucun utilisateur n'a encore le rôle SuperAdmin
    IF NOT EXISTS (
        SELECT 1 FROM "user_has_role" WHERE "role_id" = 1
    ) THEN
        -- Insérer le rôle SuperAdmin pour le tout premier utilisateur
        INSERT INTO "user_has_role"("role_id", "user_id") 
        VALUES (1, NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger pour appeler la fonction après chaque insertion dans la table "user"
DROP TRIGGER IF EXISTS assign_superadmin_trigger ON "user";
CREATE TRIGGER assign_superadmin_trigger
AFTER INSERT ON "user"
FOR EACH ROW EXECUTE FUNCTION assign_superadmin_role();
