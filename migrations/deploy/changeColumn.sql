BEGIN;

-- 1. Ajouter la colonne sans la contrainte NOT NULL
ALTER TABLE "user"
ADD COLUMN IF NOT EXISTS activity_id INT REFERENCES "activity"("id") ON DELETE SET DEFAULT;

-- 2. Mettre à jour les valeurs NULL existantes avec la valeur par défaut (47)
UPDATE "user"
SET activity_id = 47
WHERE activity_id IS NULL;

-- 3. Ajouter la contrainte NOT NULL maintenant que toutes les lignes ont une valeur
ALTER TABLE "user"
ALTER COLUMN activity_id SET NOT NULL;

-- 4. Définir la valeur par défaut pour les futures insertions
ALTER TABLE "user"
ALTER COLUMN activity_id SET DEFAULT 47;

COMMIT;