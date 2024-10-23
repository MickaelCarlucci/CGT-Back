-- Deploy CGT-back:V6.2 to pg

BEGIN;

INSERT INTO "user"("pseudo", "firstname", "lastname", "mail", "firebaseUID", "center_id", "activity_id", "emailverified")
VALUES 
('Mike', 'Mickael', 'Carlucci', 'frewmike17@gmail.com', '65pK3PDz6TP5cmx9Hhxm2yhkRrg2', 1, 47, true);

INSERT INTO "user_has_role"("role_id", "user_id")
VALUES
(1, 1);

COMMIT;
