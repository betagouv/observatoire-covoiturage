DROP TABLE IF EXISTS perimeters.cerema_aom_2019;
CREATE TABLE IF NOT EXISTS perimeters.cerema_aom_2019 (
  id SERIAL PRIMARY KEY,
  id_reseau varchar,
  region varchar,
  departement varchar,
  nom_reseau varchar,
  nom_aom varchar,
  forme_juridique_aom varchar,
  siren_aom varchar,  
  siren_group varchar,
  nom_group varchar,
  forme_juridique_group varchar,
  nb_membres integer,
  pop_aom integer,
  siren_membre varchar,
  com varchar,
  nom_membre varchar,
  pop_com varchar
);
CREATE INDEX cerema_aom_2019_id_index ON perimeters.cerema_aom_2019 USING btree (id);
