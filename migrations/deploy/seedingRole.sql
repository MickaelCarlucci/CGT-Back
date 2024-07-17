-- Deploy CGT-back:seedingRole to pg

BEGIN;

INSERT INTO "role" ("name")
VALUES
('SuperAdmin'),
('Admin'),
('Mod\u00E9rateur'),
('DSC'),
('Elus'),
('Membre');

COMMIT;
