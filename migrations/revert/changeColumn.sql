BEGIN;

-- 1. Supprimer la contrainte NOT NULL si elle existe
ALTER TABLE "user"
ALTER COLUMN activity_id DROP NOT NULL;

-- 2. Supprimer la colonne activity_id de la table user
ALTER TABLE "user"
DROP COLUMN IF EXISTS activity_id;

COMMIT;