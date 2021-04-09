INSERT INTO perimeters.aom_2019 (id_reseau,l_aom,geom)
SELECT a.id_reseau::integer,a.nom_aom,st_multi(st_union(b.geom)) AS geom FROM perimeters.cerema_aom_2019 a
LEFT JOIN perimeters.etalab_com_100m_2019 b ON a.com = b.code
WHERE id_reseau <> '/'
GROUP BY a.id_reseau,a.nom_aom