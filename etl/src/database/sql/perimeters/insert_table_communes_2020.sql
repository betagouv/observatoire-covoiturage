INSERT INTO  perimeters.communes_2020(com,l_com,statut,epci,l_epci,aom,l_aom,dep,l_dep,reg,l_reg,geom)
WITH temp as(
SELECT * FROM
json_to_recordset($1)
as temp(type varchar, properties json,geometry json)
),
passage_arr as (
  SELECT a.codgeo,
  CASE WHEN b.arr IS NULL THEN a.codgeo
  ELSE b.arr END as arr
  FROM perimeters.insee_perim_2020 a
  LEFT JOIN perimeters.passage_arr b ON a.codgeo = b.com
)
SELECT (a.properties->>'INSEE_COM')::varchar(5) as com,
(a.properties->>'NOM_COM')::varchar as l_com,
CASE WHEN (a.properties->>'STATUT')::varchar IS NULL THEN 'Arrondissement municipal'
ELSE (a.properties->>'STATUT')::varchar 
END as statut,
c.epci,
c.libepci as l_epci,
f.id_reseau as aom,
f.nom_aom as l_aom,
c.dep,
d.libelle as l_dep,
c.reg,
e.libelle as l_reg,
st_multi(st_geomfromgeojson(a.geometry)) as geom 
FROM temp a
LEFT JOIN passage_arr b ON a.properties->>'INSEE_COM' = b.arr
LEFT JOIN perimeters.insee_perim_2020 c ON b.codgeo = c.codgeo
LEFT JOIN perimeters.insee_dep_2021 d ON c.dep = d.dep
LEFT JOIN perimeters.insee_reg_2021 e ON c.reg = e.reg
LEFT JOIN perimeters.cerema_aom_2020 f ON c.codgeo = f.com
ORDER BY a.properties->>'INSEE_COM';