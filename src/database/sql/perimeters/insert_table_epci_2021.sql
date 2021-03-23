INSERT INTO perimeters.epci_2021 (epci,l_epci,geom)
SELECT a.epci, a.libepci, st_multi(st_union(c.geom)) as geom 
FROM perimeters.insee_perim_2021 a
LEFT JOIN perimeters.passage_com b on a.codgeo = b.com_2021
LEFT JOIN perimeters.etalab_com_100m_2019 c ON b.com_2019 = c.code
GROUP BY a.epci,a.libepci