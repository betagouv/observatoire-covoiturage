INSERT INTO  perimeters.epci_2019(epci,l_epci,geom)
SELECT  epci, l_epci,st_multi(st_union(geom)) as geom
FROM perimeters.communes_2019
WHERE epci IS NOT NULL
GROUP BY epci,l_epci