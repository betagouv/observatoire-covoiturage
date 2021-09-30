INSERT INTO covoiturage.aires(id_lieu,nom_lieu,ad_lieu,com_lieu,insee,type,date_maj,ouvert,source,xlong,ylat,nbre_pl,nbre_pmr,duree,horaires,proprio,lumiere,comm)
SELECT * FROM
json_to_recordset($1)
as temp(
  id_lieu varchar,
  nom_lieu varchar,
  ad_lieu varchar,
  com_lieu varchar,
  insee varchar,
  type varchar,
  date_maj date,
  ouvert boolean,
  source varchar,
  xlong varchar,
  ylat varchar,
  nbre_pl varchar,
  nbre_pmr varchar,
  duree varchar,
  horaires varchar,
  proprio varchar,
  lumiere varchar,
  comm varchar
);