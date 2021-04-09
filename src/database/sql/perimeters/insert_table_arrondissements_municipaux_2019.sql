INSERT INTO  perimeters.arrondissements_municipaux_2019(arr,l_arr,epci,l_epci,aom,l_aom,dep,l_dep,reg,l_reg,geom)
WITH temp as(
  SELECT * FROM
  json_to_recordset($1)
  as temp(type varchar, properties json,geometry json)
),
perim as (
  SELECT a.arr, b.epci,b.libepci as l_epci,
  CASE WHEN c.id_reseau = '/' THEN NULL ELSE c.id_reseau END as aom,
  c.nom_aom as l_aom,d.dep, d.libelle as l_dep, e.reg, e.libelle as l_reg 
  FROM perimeters.passage_arr a
  LEFT JOIN perimeters.insee_perim_2019 b ON a.com = b.codgeo
  LEFT JOIN perimeters.cerema_aom_2019 c ON a.com = c.com
  LEFT JOIN perimeters.insee_dep_2021 d on b.dep = d.dep
  LEFT JOIN perimeters.insee_reg_2021 e on b.reg = e.reg
  UNION
  SELECT a.codgeo as arr, a.epci, a.libepci as l_epci,
  CASE WHEN b.id_reseau = '/' THEN NULL ELSE b.id_reseau END as aom,
  b.nom_aom as l_aom, c.dep, c.libelle as l_dep, d.reg, d.libelle as l_reg
  FROM perimeters.insee_perim_2019 a
  LEFT JOIN perimeters.cerema_aom_2019 b ON a.codgeo = b.com
  LEFT JOIN perimeters.insee_dep_2021 c on a.dep = c.dep
  LEFT JOIN perimeters.insee_reg_2021 d on a.reg = d.reg
  WHERE codgeo NOT IN ('75056','69123','13055')
  ORDER BY arr
)
SELECT (properties->>'INSEE_COM')::varchar(5) as arr,
(properties->>'NOM_COM')::varchar as l_arr,
epci,
l_epci,
aom,
l_aom,
dep,
l_dep,
reg,
l_reg,
st_multi(st_geomfromgeojson(a.geometry)) as geom 
FROM temp a
LEFT JOIN perim b ON a.properties->>'INSEE_COM' = b.arr
WHERE a.properties->>'INSEE_COM' NOT IN ('75056','69123','13055')
ORDER BY a.properties->>'INSEE_COM';