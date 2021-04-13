INSERT INTO  perimeters.chefs_lieux_2020(com,l_com,statut,geom)
WITH temp as(
SELECT * FROM
json_to_recordset($1)
as temp(type varchar, properties json,geometry json)
)
SELECT (properties->>'INSEE_COM')::varchar(5) as com,
(properties->>'NOM_CHF')::varchar as l_com,
CASE WHEN (properties->>'STATUT')::varchar IS NULL THEN 'Arrondissement municipal'
ELSE (properties->>'STATUT')::varchar 
END as statut,
st_geomfromgeojson(geometry) as geom 
FROM temp
ORDER BY properties->>'INSEE_COM';