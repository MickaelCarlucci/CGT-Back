-- Deploy CGT-back:V1 to pg

BEGIN;

CREATE table "user" (
     "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     "pseudo" TEXT NOT NULL,
     "firstname" 
)

COMMIT;
