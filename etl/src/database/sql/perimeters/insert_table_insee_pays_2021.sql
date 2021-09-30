INSERT INTO perimeters.insee_pays_2021(cog, actual, capay, crpay, ani, libcog, libenr, ancnom, codeiso2, codeiso3, codenum3)
SELECT * FROM
json_to_recordset($1)
as temp(
  cog varchar,
  actual varchar,
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