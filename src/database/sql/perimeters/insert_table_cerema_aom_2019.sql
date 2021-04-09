INSERT INTO  perimeters.cerema_aom_2019(id_reseau,  region, departement, nom_reseau, nom_aom, forme_juridique_aom, siren_aom, siren_group,
nom_group, forme_juridique_group, nb_membres, pop_aom, siren_membre, com, nom_membre, pop_com)
SELECT * FROM
json_to_recordset($1) 
as temp("Id réseau" varchar,
  "Région siège" varchar,
  "Département siège" varchar,
  "Nom du réseau" varchar,
  "Nom de l’AOM" varchar,
  "Forme juridique de l’AOM" varchar,
  "N° SIREN de l’AOM" varchar,
  "N° SIREN de l’EPCI" varchar,
  "Nom de l’EPCI" varchar,
  "Nature juridique de l’EPCI" varchar,
  "Nombre de membres" integer,
  "Population" integer,
  "Siren membre" varchar,
  "Code INSEE" varchar,
  "Nom membre" varchar,
  "Population  municipale" varchar);