-- Revert CGT-back:V1 from pg

BEGIN;

DROP TABLE "center", "activity", "center_has_activity", "user", "role", "user_has_role", "section", "information", "leaflet_stored";

COMMIT;
