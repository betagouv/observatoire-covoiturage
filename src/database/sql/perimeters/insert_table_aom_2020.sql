INSERT INTO perimeters.aom_2020 (id_reseau,l_aom,geom)
WITH com AS (
SELECT b.com_2020 AS com, st_union(a.geom) AS geom FROM perimeters.etalab_com_100m_2019 a
LEFT JOIN perimeters.passage_com b ON a.code = b.com_2019
GROUP BY b.com_2020
)
SELECT a.id_reseau,a.nom_aom,st_multi(st_union(b.geom)) AS geom FROM perimeters.cerema_aom_2020 a
LEFT JOIN com b ON a.com = b.com
WHERE id_reseau IS NOT NULL
GROUP BY a.id_reseau,a.nom_aom