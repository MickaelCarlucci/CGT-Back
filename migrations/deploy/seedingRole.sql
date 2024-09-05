-- Deploy CGT-back:seedingRole to pg

BEGIN;
SET client_encoding = 'UTF8';

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
