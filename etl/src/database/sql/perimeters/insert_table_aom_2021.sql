INSERT INTO  perimeters.aom_2021(aom,l_aom,geom)
SELECT aom, l_aom, st_multi(st_union(geom)) as geom
FROM perimeters.communes_2021
WHERE aom IS NOT NULL
GROUP BY aom,l_aom