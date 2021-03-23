DROP TABLE IF EXISTS perimeters.epci_2021;
CREATE TABLE IF NOT EXISTS perimeters.epci_2021 (
  id SERIAL PRIMARY KEY,
  epci varchar(9) NOT NULL UNIQUE,
  l_epci varchar,
  geom geometry(MULTIPOLYGON,4326)
);
CREATE INDEX epci_2021_id_index ON perimeters.epci_2021 USING btree (id);
CREATE INDEX epci_2021_geom_index ON perimeters.epci_2021 USING gist (geom);