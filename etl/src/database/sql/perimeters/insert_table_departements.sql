INSERT INTO  perimeters.departements(dep,l_dep,geom)
SELECT  dep, l_dep,st_multi(st_union(geom)) as geom
FROM perimeters.communes_2021
GROUP BY dep,l_dep