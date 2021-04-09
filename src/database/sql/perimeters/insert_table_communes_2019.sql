INSERT INTO  perimeters.communes_2019(com,l_com,epci,l_epci,aom,l_aom,dep,l_dep,reg,l_reg,geom)
WITH temp as(
SELECT * FROM
json_to_recordset($1)
as temp(type varchar, properties json,geometry json)
)
SELECT (a.properties->>'INSEE_COM')::varchar(5) as com,
(a.properties->>'NOM_COM')::varchar as l_com,
(a.properties->>'CODE_EPCI')::varchar as epci,
b.libepci as l_epci,
CASE WHEN e.id_reseau = '/' THEN NULL ELSE e.id_reseau END as aom,
e.nom_aom as l_aom,
(a.properties->>'INSEE_DEP')::varchar(3) as dep,
c.libelle as l_dep,
(a.properties->>'INSEE_REG')::varchar(2) as reg,
d.libelle as l_reg,
st_multi(st_geomfromgeojson(a.geometry)) as geom 
FROM temp a
LEFT JOIN perimeters.insee_perim_2019 b ON a.properties->>'INSEE_COM' = b.codgeo
LEFT JOIN perimeters.insee_dep_2021 c ON a.properties->>'INSEE_DEP' = c.dep
LEFT JOIN perimeters.insee_reg_2021 d ON a.properties->>'INSEE_REG' = d.reg
LEFT JOIN perimeters.cerema_aom_2019 e ON a.properties->>'INSEE_COM' = e.com
WHERE a.properties->>'STATUT' <> 'Arrondissement municipal'
ORDER BY a.properties->>'INSEE_COM';