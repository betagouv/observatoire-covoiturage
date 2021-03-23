INSERT INTO perimeters.epci_2019 (epci,l_epci,geom)
SELECT a.epci, a.libepci, st_multi(st_union(b.geom)) as geom 
FROM perimeters.insee_perim_2019 a
LEFT JOIN perimeters.etalab_com_100m_2019 b ON a.codgeo = b.code
GROUP BY a.epci,a.libepci