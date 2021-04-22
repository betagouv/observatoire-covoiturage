DROP TABLE IF EXISTS perimeters.regions;
CREATE TABLE IF NOT EXISTS perimeters.regions (
  id SERIAL PRIMARY KEY,
  reg varchar(3),
  l_reg varchar,
  geom geometry(MULTIPOLYGON,4326)
);
CREATE INDEX regions_id_index ON perimeters.regions USING btree (id);