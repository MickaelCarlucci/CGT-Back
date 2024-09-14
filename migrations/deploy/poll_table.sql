-- Deploy CGT-back:poll_table to pg

BEGIN;

CREATE TABLE "poll" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     "question" TEXT NOT NULL,
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
     "updated_at" TIMESTAMPTZ
);

CREATE TABLE "poll_options" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "option" TEXT NOT NULL,
    "vote" INTEGER DEFAULT 0,
    "poll_id" INT REFERENCES "poll"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);


COMMIT;
