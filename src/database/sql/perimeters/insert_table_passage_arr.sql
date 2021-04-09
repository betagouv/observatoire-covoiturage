INSERT INTO  perimeters.passage_arr(arr,com)
SELECT com, comparent
FROM perimeters.insee_com_2021
WHERE typecom = 'ARM'
ORDER BY com;