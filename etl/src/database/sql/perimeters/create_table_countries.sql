DROP TABLE IF EXISTS perimeters.countries;
CREATE TABLE IF NOT EXISTS perimeters.countries (
  id SERIAL PRIMARY KEY,
  insee_cog varchar,
  name varchar,
  geom geometry(MULTIPOLYGON,4326)
);
CREATE INDEX countries_id_index ON perimeters.countries USING btree (id);