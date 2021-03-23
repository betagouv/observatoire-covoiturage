DROP TABLE IF EXISTS perimeters.etalab_com_1000m_2019;
CREATE TABLE IF NOT EXISTS perimeters.etalab_com_1000m_2019 (
  id SERIAL PRIMARY KEY,
  code varchar(5) NOT NULL UNIQUE,
  nom varchar,
  departement varchar(3),
  region varchar(2),
  geom geometry(MULTIPOLYGON,4326)
);
CREATE INDEX etalab_com_1000m_2019_id_index ON perimeters.etalab_com_1000m_2019 USING btree (id);
CREATE INDEX etalab_com_1000m_2019_geom_index ON perimeters.etalab_com_1000m_2019 USING gist (geom);