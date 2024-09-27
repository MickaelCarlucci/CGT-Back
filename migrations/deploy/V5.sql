BEGIN;
SET client_encoding = 'UTF8';

CREATE table "appointment" (
     "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     "subject" TEXT NOT NULL,
     "date" TEXT NOT NULL,
     "linkMeeting" TEXT NOT NULL CHECK ("linkMeeting" ~ '^https?:\/\/.*'),
     "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
     "updated_at" TIMESTAMPTZ
);

INSERT INTO "appointment" ("subject", "date", "linkMeeting")
VALUES
('A définir', 'A définir', 'http://example.com');

COMMIT;
