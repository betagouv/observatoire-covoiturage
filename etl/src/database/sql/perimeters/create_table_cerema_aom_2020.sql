DROP TABLE IF EXISTS perimeters.cerema_aom_2020;
CREATE TABLE IF NOT EXISTS perimeters.cerema_aom_2020 (
  id SERIAL PRIMARY KEY,
  id_reseau integer,
  nom_reseau varchar,
  siren_aom integer,
  nom_aom varchar,
  forme_juridique_aom varchar,
  region varchar,
  departement varchar,
  siren_group integer,
  lien_banatic varchar,
  nom_group varchar,
  forme_juridique_group varchar,
  nb_membres integer,
  pop_aom_2017 integer,
  siren_membre integer,
  com varchar,
  nom_membre varchar,
  pop_com_2017 varchar,
  pop_banatic_2017 integer,
  surface integer,
  nom_com varchar,
  wikipedia varchar
);
CREATE INDEX cerema_aom_2020_id_index ON perimeters.cerema_aom_2020 USING btree (id);
