INSERT INTO  perimeters.chefs_lieux_2021(com,l_com,statut,geom)
SELECT a.com, a.l_com,b.statut, b.geom 
FROM perimeters.communes_2021 a
LEFT JOIN perimeters.chefs_lieux_2020 b ON a.com = b.com;