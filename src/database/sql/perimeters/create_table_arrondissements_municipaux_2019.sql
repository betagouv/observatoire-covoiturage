DROP TABLE IF EXISTS perimeters.arrondissements_municipaux_2019;
CREATE TABLE IF NOT EXISTS perimeters.arrondissements_municipaux_2019 (
  id SERIAL PRIMARY KEY,
  arr varchar(5) NOT NULL UNIQUE,
  l_arr varchar,
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
CREATE INDEX arrondissements_municipaux_2019_id_index ON perimeters.arrondissements_municipaux_2019 USING btree (id);
CREATE INDEX arrondissements_municipaux_2019_geom_index ON perimeters.arrondissements_municipaux_2019 USING gist (geom);