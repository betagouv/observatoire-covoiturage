INSERT INTO perimeters.insee_com_2021(typecom, com, reg, dep, ctcd, arr, tncc, ncc, nccenr, libelle, can, comparent)
SELECT * FROM
json_to_recordset($1)
as temp(
  typecom varchar,
  com varchar,
  reg varchar,
  dep varchar,
  ctcd varchar,
  arr varchar,
  tncc varchar,
  ncc varchar,
  nccenr varchar,
  libelle varchar,
  can varchar,
  comparent varchar
);