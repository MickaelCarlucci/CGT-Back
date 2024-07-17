-- Revert CGT-back:seedingRole from pg

BEGIN;

TRUNCATE TABLE "role" CASCADE;

COMMIT;
