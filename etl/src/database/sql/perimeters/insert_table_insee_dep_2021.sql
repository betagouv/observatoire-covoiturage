INSERT INTO perimeters.insee_dep_2021(dep, reg, chef_lieu, tncc, ncc, nccenr, libelle)
SELECT * FROM
json_to_recordset($1)
as temp(
  dep varchar,
  reg varchar,
  chef_lieu varchar,
  tncc varchar,
  ncc varchar,
  nccenr varchar,
  libelle varchar
);
