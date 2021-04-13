INSERT INTO  perimeters.regions(reg,l_reg,geom)
SELECT  reg, l_reg,st_multi(st_union(geom)) as geom
FROM perimeters.communes_2021
GROUP BY reg,l_reg