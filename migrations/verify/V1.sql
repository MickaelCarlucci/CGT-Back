-- Verify CGT-back:V1 on pg

BEGIN;

SELECT * FROM "center" WHERE false;
SELECT * FROM "activity" WHERE false;
SELECT * FROM "center_has_activity" WHERE false;
SELECT * FROM "user" WHERE false;
SELECT * FROM "role" WHERE false;
SELECT * FROM "user_has_role" WHERE false;
SELECT * FROM "section" WHERE false;
SELECT * FROM "information" WHERE false;
SELECT * FROM "leaflet_stored" WHERE false;

ROLLBACK;
