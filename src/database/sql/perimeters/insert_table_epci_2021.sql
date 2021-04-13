INSERT INTO  perimeters.epci_2021(epci,l_epci,geom)
SELECT  epci, l_epci,st_multi(st_union(geom)) as geom
FROM perimeters.communes_2021
WHERE epci IS NOT NULL
GROUP BY epci,l_epci