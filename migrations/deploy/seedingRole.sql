-- Deploy CGT-back:seedingRole to pg

BEGIN;
SET client_encoding = 'UTF8';

INSERT INTO "role" ("name")
VALUES
('SuperAdmin'),
('Admin'),
('Moderateur'),
('DS'),
('CSE'),
('CSSCT'),
('RP'),
('Membre'),
('Nouvel inscrit');


COMMIT;
