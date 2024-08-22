-- Revert CGT-back:V4 from pg

BEGIN;

DROP TABLE "user_signup";

COMMIT;
