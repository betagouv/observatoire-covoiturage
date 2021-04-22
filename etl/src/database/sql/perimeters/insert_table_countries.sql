INSERT INTO perimeters.countries(insee_cog,name,geom)
WITH temp as(
SELECT * FROM
json_to_recordset($1)
as temp(type varchar, properties json,geometry json)
)
SELECT a.cog as insee_cog, a.libcog as name,
st_multi(st_geomfromgeojson(b.geometry)) as geom 
FROM perimeters.insee_pays_2021 a
LEFT JOIN temp b on a.codeiso3 = b.properties->>'ISO3_CODE';