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

INSERT INTO "user_has_role" ("role_id", "user_id")
VALUES
(1, 1);

COMMIT;
