-- Deploy CGT-back:seedingRole to pg

BEGIN;

INSERT INTO "role" ("name")
VALUES
('SuperAdmin'),
('Admin'),
('Moderateur'),
('DSC'),
('Elus'),
('Membre'),
('Nouvel inscrit');

COMMIT;
