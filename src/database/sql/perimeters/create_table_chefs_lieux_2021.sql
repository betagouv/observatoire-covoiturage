DROP TABLE IF EXISTS perimeters.chefs_lieux_2021;
CREATE TABLE IF NOT EXISTS perimeters.chefs_lieux_2021 (
  id SERIAL PRIMARY KEY,
  com varchar(5) NOT NULL UNIQUE,
  l_com varchar,
  statut varchar,
  geom geometry(POINT,4326)
);
CREATE INDEX chefs_lieux_2021_id_index ON perimeters.chefs_lieux_2021 USING btree (id);
CREATE INDEX chefs_lieux_2021_geom_index ON perimeters.chefs_lieux_2021 USING gist (geom);