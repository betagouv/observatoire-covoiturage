INSERT INTO perimeters.insee_mvt_communes(mod, date_eff, typecom_av, com_av, tncc_av, ncc_av, nccenr_av, libelle_av, typecom_ap, com_ap, tncc_ap, ncc_ap, nccenr_ap, libelle_ap)
SELECT * FROM
json_to_recordset($1)
as temp(
  mod int2, 
  date_eff varchar, 
  typecom_av varchar, 
  com_av varchar,  
  tncc_av varchar,  
  ncc_av varchar,
  nccenr_av varchar,
  libelle_av varchar,
  typecom_ap varchar,
  com_ap varchar,
  tncc_ap varchar,
  ncc_ap varchar,
  nccenr_ap varchar,
  libelle_ap varchar
);
