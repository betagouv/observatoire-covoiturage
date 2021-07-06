DROP TABLE IF EXISTS perimeters.cerema_aom_2021;
CREATE TABLE IF NOT EXISTS perimeters.cerema_aom_2021 (
  id SERIAL PRIMARY KEY,
  id_reseau integer,
  nom_reseau varchar,
  siren_aom integer,
  nom_aom varchar,
  forme_juridique_aom varchar,
  region varchar,
  departement varchar,
  siren_group varchar,
  lien_banatic varchar,
  nom_group varchar,
  forme_juridique_group varchar,
  nb_membres varchar,
  pop_aom_2018 integer,
  siren_membre integer,
  com varchar,
  nom_membre varchar,
  pop_com_2018 varchar,
  pop_banatic_2018 integer,
  surface float,
  nom_com varchar,
  wikipedia varchar
);
CREATE INDEX cerema_aom_2021_id_index ON perimeters.cerema_aom_2021 USING btree (id);
