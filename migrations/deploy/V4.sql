-- Deploy CGT-back:V4 to pg

BEGIN;

CREATE table "user_signup" (
     "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     "pseudo" VARCHAR(30) NOT NULL UNIQUE,
     "firstname" VARCHAR(20) NOT NULL,
     "lastname" VARCHAR(20) NOT NULL,
     "mail" VARCHAR(50) NOT NULL UNIQUE,
     "password" TEXT NOT NULL,
     "first_question" VARCHAR(60) NOT NULL,
     "first_answer" TEXT NOT NULL,
     "second_question" VARCHAR(60) NOT NULL,
     "second_answer" TEXT NOT NULL,
     "center_id" INT NOT NULL REFERENCES "center"("id") DEFAULT 14,
     "token" TEXT NOT NULL UNIQUE,
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
     "updated_at" TIMESTAMPTZ
);

COMMIT;
