INSERT INTO  perimeters.arrondissements_municipaux_2021(arr,l_arr,epci,l_epci,aom,l_aom,dep,l_dep,reg,l_reg,geom)
SELECT a.arr, b.l_arr, b.epci,b.l_epci,b.aom, b.l_aom,b.dep, b.l_dep, b.reg, b.l_reg,b.geom 
FROM perimeters.passage_arr a
LEFT JOIN perimeters.arrondissements_municipaux_2020 b ON a.arr = b.arr
UNION 
SELECT a.codgeo as arr, a.libgeo as l_arr,a.epci, f.id_reseau::varchar as aom, f.nom_aom as l_aom, a.libepci as l_epci,a.dep,d.libelle as l_dep,a.reg,e.libelle as l_reg, st_multi(st_union(c.geom)) as geom 
FROM perimeters.insee_perim_2021 a
LEFT JOIN perimeters.passage_com b ON a.codgeo = b.com_2021
LEFT JOIN perimeters.communes_2020 c ON b.com_2020 = c.com
LEFT JOIN perimeters.insee_dep_2021 d ON a.dep = d.dep
LEFT JOIN perimeters.insee_reg_2021 e ON a.reg = e.reg
LEFT JOIN perimeters.cerema_aom_2020 f ON b.com_2020 = f.com
WHERE codgeo NOT IN ('75056','69123','13055')
GROUP BY a.codgeo,a.libgeo,a.epci,a.libepci,f.id_reseau,f.nom_aom,a.dep,d.libelle,a.reg,e.libelle;