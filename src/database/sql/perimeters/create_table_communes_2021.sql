DROP TABLE IF EXISTS perimeters.communes_2021;
CREATE TABLE IF NOT EXISTS perimeters.communes_2021 (
  id SERIAL PRIMARY KEY,
  com varchar(5) NOT NULL UNIQUE,
  l_com varchar,
  epci varchar(9),
  l_epci varchar,
  aom varchar,
  l_aom varchar,
  dep varchar(3),
  l_dep varchar,
  reg varchar(2),
  l_reg varchar,
  geom geometry(MULTIPOLYGON,4326)
);
CREATE INDEX communes_2021_id_index ON perimeters.communes_2021 USING btree (id);
CREATE INDEX communes_2021_geom_index ON perimeters.communes_2021 USING gist (geom);