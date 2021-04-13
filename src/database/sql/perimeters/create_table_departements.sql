DROP TABLE IF EXISTS perimeters.departements;
CREATE TABLE IF NOT EXISTS perimeters.departements (
  id SERIAL PRIMARY KEY,
  dep varchar(3),
  l_dep varchar,
  geom geometry(MULTIPOLYGON,4326)
);
CREATE INDEX departements_id_index ON perimeters.departements USING btree (id);