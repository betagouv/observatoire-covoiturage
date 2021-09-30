INSERT INTO perimeters.insee_reg_2021(reg, chef_lieu, tncc, ncc, nccenr, libelle)
SELECT * FROM
json_to_recordset($1)
as temp(
  reg varchar,
  chef_lieu varchar,
  tncc varchar,
  ncc varchar,
  nccenr varchar,
  libelle varchar
);
