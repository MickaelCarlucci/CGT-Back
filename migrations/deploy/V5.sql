-- Deploy CGT-back:V5 to pg

BEGIN;
SET client_encoding = 'UTF8';

CREATE table "appointment" (
     "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     "subject" TEXT NOT NULL,
     "date" TEXT NOT NULL,
     "link" TEXT NOT NULL,
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
     "updated_at" TIMESTAMPTZ
);

INSERT INTO "appointment" ("subject", "date", "link")
VALUES
('A définir', 'A définir', 'A définir');

COMMIT;
