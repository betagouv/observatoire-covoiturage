DROP TABLE IF EXISTS perimeters.passage_arr;
CREATE TABLE IF NOT EXISTS perimeters.passage_arr (
  id SERIAL PRIMARY KEY,
  arr varchar(5),
  com varchar(5)
);
CREATE INDEX passage_arr_id_index ON perimeters.passage_arr USING btree (id);