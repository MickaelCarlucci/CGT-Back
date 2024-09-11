-- Deploy CGT-back:poll_table to pg

BEGIN;

CREATE TABLE "poll" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     "question" TEXT NOT NULL,
     "options" TEXT NOT NULL,
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
     "updated_at" TIMESTAMPTZ
);

COMMIT;
