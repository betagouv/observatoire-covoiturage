INSERT INTO  perimeters.communes_2021(com,l_com,statut,epci,l_epci,aom,l_aom,dep,l_dep,reg,l_reg,geom)
SELECT a.codgeo as com, a.libgeo as l_com,c.statut, a.epci, a.libepci as l_epci, f.id_reseau::varchar as aom, f.nom_aom as l_aom,a.dep,d.libelle as l_dep,a.reg,e.libelle as l_reg, st_multi(st_union(c.geom)) as geom 
FROM perimeters.insee_perim_2021 a
LEFT JOIN perimeters.passage_com b ON a.codgeo = b.com_2021
LEFT JOIN perimeters.communes_2020 c ON b.com_2020 = c.com
LEFT JOIN perimeters.insee_dep_2021 d ON a.dep = d.dep
LEFT JOIN perimeters.insee_reg_2021 e ON a.reg = e.reg
LEFT JOIN perimeters.cerema_aom_2021 f ON b.com_2021 = f.com
GROUP BY a.codgeo,a.libgeo,c.statut,a.epci,a.libepci,f.id_reseau,f.nom_aom,a.dep,d.libelle,a.reg,e.libelle
UNION
SELECT com,l_com,statut,epci,l_epci,aom,l_aom,dep,l_dep,reg,l_reg,geom
FROM perimeters.communes_2020
WHERE statut = 'Arrondissement municipal';