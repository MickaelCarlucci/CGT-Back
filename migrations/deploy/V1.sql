-- Deploy CGT-back:V1 to pg

BEGIN;

CREATE table "center" (
     "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     "name" VARCHAR(30) NOT NULL UNIQUE,
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
     "updated_at" TIMESTAMPTZ
);

CREATE table "activity" (
     "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     "name" VARCHAR(30) NOT NULL UNIQUE,
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
     "updated_at" TIMESTAMPTZ
);

CREATE table "center_has_activity" (
     "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     "center_id" INT NOT NULL REFERENCES "center"("id") ON DELETE CASCADE,
     "activity_id" INT NOT NULL REFERENCES "activity"("id") ON DELETE CASCADE,
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE table "user" (
     "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     "pseudo" VARCHAR(30) NOT NULL UNIQUE,
     "firstname" VARCHAR(20) NOT NULL,
     "lastname" VARCHAR(20) NOT NULL,
     "mail" VARCHAR(50) NOT NULL UNIQUE,
     "firebaseUID" TEXT NOT NULL UNIQUE,
     "first_question" VARCHAR(60) NOT NULL,
     "first_answer" VARCHAR(50) NOT NULL,
     "second_question" VARCHAR(60) NOT NULL,
     "second_answer" VARCHAR(50) NOT NULL,
     "center_id" INT NOT NULL REFERENCES "center"("id") ON DELETE SET DEFAULT,
     "last_activity" TIMESTAMPTZ DEFAULT now(),
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
     "updated_at" TIMESTAMPTZ
);

ALTER TABLE "user" ALTER COLUMN "center_id" SET DEFAULT 14;

CREATE table "role" (
     "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     "name" VARCHAR(30) NOT NULL UNIQUE,
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
     "updated_at" TIMESTAMPTZ
);

CREATE table "user_has_role" (
     "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     "role_id" INT NOT NULL REFERENCES "role"("id") ON DELETE CASCADE,
     "user_id" INT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
     UNIQUE ("role_id", "user_id"),
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE table "section" (
     "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     "name" VARCHAR(30) NOT NULL UNIQUE,
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
     "updated_at" TIMESTAMPTZ
);

CREATE table "information" (
     "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     "title" VARCHAR(100) NOT NULL,
     "contain" TEXT,
     "image_url" TEXT,
     "user_id" INT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
     "section_id" INT NOT NULL REFERENCES "section"("id") ON DELETE CASCADE,
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
     "updated_at" TIMESTAMPTZ
);


CREATE table "leaflet_stored" (
     "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     "title" VARCHAR(200) NOT NULL,
     "pdf_url" VARCHAR(200) NOT NULL,
     "section_id" INT NOT NULL REFERENCES "section"("id") ON DELETE CASCADE,
     "center_id" INT NOT NULL REFERENCES "center"("id") ON DELETE CASCADE,
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
     "updated_at" TIMESTAMPTZ
);

COMMIT;