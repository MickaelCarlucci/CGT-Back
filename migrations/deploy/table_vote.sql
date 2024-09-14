-- Deploy CGT-back:table_vote to pg

BEGIN;

CREATE table "votes" (
     "user_id" INTEGER REFERENCES "user"("id") ON DELETE CASCADE,
     "poll_id" INTEGER REFERENCES "poll"("id") ON DELETE CASCADE,
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
     "updated_at" TIMESTAMPTZ,
     UNIQUE(user_id, poll_id)
);


COMMIT;
