DROP TABLE IF EXISTS perimeters.insee_com_2021;
CREATE TABLE IF NOT EXISTS perimeters.insee_com_2021 (
  id SERIAL PRIMARY KEY,
  typecom varchar,
  com varchar(5) NOT NULL,
  reg varchar(2),
  dep varchar(3),
  ctcd varchar,
  arr varchar,
  tncc varchar,
  ncc varchar,
  nccenr varchar,
  libelle varchar,
  can varchar,
  comparent varchar(5)
);
CREATE INDEX insee_com_2021_id_index ON perimeters.insee_com_2021 USING btree (id);