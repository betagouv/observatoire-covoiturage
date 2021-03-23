INSERT INTO  perimeters.insee_perim_2019(codgeo,libgeo,epci,libepci,dep,reg)
SELECT * FROM
json_to_recordset($1) 
as temp("CODGEO" varchar, "LIBGEO" varchar,"EPCI" varchar,"LIBEPCI" varchar,"DEP" varchar,"REG" varchar);