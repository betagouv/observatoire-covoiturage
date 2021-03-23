INSERT INTO  perimeters.etalab_com_100m_2019(code,nom,departement,region,geom)
WITH temp as(
SELECT * FROM
json_to_recordset($1)
as temp(type varchar, properties json,geometry json)
)
SELECT (properties->>'code')::varchar(5) as code,
(properties->>'nom')::varchar as nom,
(properties->>'departement')::varchar(3) as departement,
(properties->>'region')::varchar(2) as region,
st_multi(st_geomfromgeojson(geometry)) as geom 
FROM temp;