DROP TABLE IF EXISTS perimeters.passage_com;
CREATE TABLE IF NOT EXISTS perimeters.passage_com (
  id SERIAL PRIMARY KEY,
  com_2019 varchar(5),
  com_2020 varchar(5),
  com_2021 varchar(5)
);
CREATE INDEX passage_com_id_index ON perimeters.passage_com USING btree (id);