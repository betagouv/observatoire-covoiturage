DROP TABLE IF EXISTS perimeters.aom_2021;
CREATE TABLE IF NOT EXISTS perimeters.aom_2021 (
  id SERIAL PRIMARY KEY,
  aom varchar(9) NOT NULL UNIQUE,
  l_aom varchar,
  geom geometry(MULTIPOLYGON,4326)
);
CREATE INDEX aom_2021_id_index ON perimeters.aom_2021 USING btree (id);
CREATE INDEX aom_2021_geom_index ON perimeters.aom_2021 USING gist (geom);