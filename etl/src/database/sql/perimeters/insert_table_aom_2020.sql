INSERT INTO  perimeters.aom_2020(aom,l_aom,geom)
SELECT aom, l_aom, st_multi(st_union(geom)) as geom
FROM perimeters.communes_2020
WHERE aom IS NOT NULL
GROUP BY aom,l_aom