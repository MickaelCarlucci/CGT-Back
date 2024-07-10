BEGIN;

INSERT INTO "center" ("name")
VALUES
('Villeneuve d''Ascq'),
('Reims'),
('Bordeaux'),
('Blagnac'),
('Niort'),
('Lyon'),
('Laval'),
('Le Mans'),
('Orléans'),
('Stephenson'),
('Montigny'),
('Montpellier'),
('Belfort'),
('Pas de centre');

INSERT INTO "activity" ("name")
VALUES
('EDF'),
('Groupama'),
('Engie'),
('Ada'),
('Leroy Merlin'),
('AG2R'),
('Verisure'),
('L''école francaise'),
('GPSO'),
('Smoove'),
('Lease Plan'),
('FGDR'),
('Orias'),
('Lyreco'),
('Société Générale'),
('LIDL'),
('Veolia'),
('MNT'),
('Bouygues Immobilier'),
('Octopus'),
('AXA'),
('Macif'),
('Ekwateur'),
('BNP'),
('LMP'),
('Bayi'),
('Bouygues Telecom'),
('Action Logement'),
('Aiguillon Construction'),
('Lyon Métropole Habitat'),
('2FRH'),
('ANFR'),
('Orange'),
('LG'),
('Edenred'),
('Grohe'),
('Atlantic'),
('JVC'),
('OCP Répartition'),
('Vestel'),
('Karapace Courtage'),
('Générali'),
('OWF'),
('Air Liquide'),
('Iberdrola'),
('France Billet'),
('Non présent dans la liste');

INSERT INTO "center_has_activity"("center_id", "activity_id")
VALUES
(1, 4),
(1, 6),
(1, 3),
(1, 45),
(1, 5),
(1, 14),
(1, 15),
(2, 42),
(2, 7),
(2, 43),
(2, 44),
(3, 6),
(3, 2),
(3, 18),
(3, 19),
(3, 20),
(3, 21),
(3, 8),
(3, 22),
(4, 1),
(4, 17),
(4, 2),
(5, 2),
(6, 28),
(6, 29),
(6, 30),
(6, 31),
(7, 27),
(8, 17),
(8, 23),
(8, 24),
(8, 25),
(8, 26),
(9, 32),
(9, 33),
(9, 34),
(9, 35),
(9, 36),
(9, 37),
(9, 38),
(9, 39),
(9, 40),
(9, 7),
(9, 41),
(10, 13),
(11, 4),
(11, 46),
(11, 9),
(11, 10),
(11, 11),
(11, 12),
(12, 17),
(13, 16),
(13, 1);

COMMIT;