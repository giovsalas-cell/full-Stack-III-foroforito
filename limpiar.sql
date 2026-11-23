UPDATE tema SET id_categoria = 2 WHERE id_categoria = 22;
UPDATE tema SET id_categoria = 4 WHERE id_categoria = 24;
UPDATE tema SET id_categoria = 5 WHERE id_categoria = 25;
DELETE FROM categoria WHERE id_categoria IN (22, 24, 25);
COMMIT;