DROP TABLE IF EXISTS perimeters.insee_perim_2021;
CREATE TABLE IF NOT EXISTS perimeters.insee_perim_2021 (
  id SERIAL PRIMARY KEY,
  codgeo varchar(5) NOT NULL UNIQUE,
  libgeo varchar,
  epci varchar(9),
  libepci varchar,
  dep varchar(3),
  reg varchar(2)
);
CREATE INDEX perim_2021_id_index ON perimeters.insee_perim_2021 USING btree (id);