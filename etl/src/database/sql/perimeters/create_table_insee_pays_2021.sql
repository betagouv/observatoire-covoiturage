DROP TABLE IF EXISTS perimeters.insee_pays_2021;
CREATE TABLE IF NOT EXISTS perimeters.insee_pays_2021 (
  id SERIAL PRIMARY KEY,
  cog varchar(5) NOT NULL,
  actual varchar(1),
  capay varchar,
  crpay varchar,
  ani varchar,
  libcog varchar,
  libenr varchar,
  ancnom varchar,
  codeiso2 varchar,
  codeiso3 varchar,
  codenum3 varchar
);
CREATE INDEX insee_pays_2021_id_index ON perimeters.insee_pays_2021 USING btree (id);