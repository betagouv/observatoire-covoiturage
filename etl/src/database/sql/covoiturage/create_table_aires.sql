DROP TABLE IF EXISTS covoiturage.aires;
CREATE TABLE IF NOT EXISTS covoiturage.aires (
  id SERIAL PRIMARY KEY,
  id_lieu varchar,
  nom_lieu varchar,
  ad_lieu varchar,
  com_lieu varchar,
  insee varchar,
  type varchar,
  date_maj date,
  ouvert boolean,
  source varchar,
  xlong varchar,
  ylat varchar,
  nbre_pl varchar,
  nbre_pmr varchar,
  duree varchar,
  horaires varchar,
  proprio varchar,
  lumiere varchar,
  comm varchar,
  geom geometry(POINT,4326)
);
CREATE INDEX aires_id_index ON covoiturage.aires USING btree (id);
CREATE INDEX aires_geom_index ON covoiturage.aires USING gist (geom);