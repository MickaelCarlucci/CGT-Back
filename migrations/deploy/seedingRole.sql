-- Deploy CGT-back:seedingRole to pg

BEGIN;

INSERT INTO "role" ("name")
VALUES
('SuperAdmin'),
('Admin'),
('Modérateur'),
('DSC'),
('Elus'),
('Membre');

COMMIT;
