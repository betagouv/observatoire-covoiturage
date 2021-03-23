INSERT INTO  perimeters.passage_com(com_2019,com_2020,com_2021)
WITH passage_2020 AS(
SELECT a.codgeo as com_2019,b.codgeo as com_2020
FROM perimeters.insee_perim_2019 a
LEFT JOIN perimeters.insee_perim_2020 b on a.codgeo = b.codgeo
UNION
SELECT com_av as com_2019,com_ap as com_2020
FROM perimeters.evolution_com
WHERE annee = 2020
ORDER BY com_2019),

passage_2021 as (
SELECT a.codgeo as com_2020,b.codgeo as com_2021 
FROM perimeters.insee_perim_2020 a
LEFT JOIN perimeters.insee_perim_2021 b ON a.codgeo = b.codgeo
UNION
SELECT com_av as com_2020,com_ap as com_2021 
FROM perimeters.evolution_com
WHERE annee = 2021
ORDER BY com_2020)

SELECT a.com_2019,b.com_2020,b.com_2021 
FROM passage_2020 a
FULL JOIN passage_2021 b ON a.com_2020 = b.com_2020;