UPDATE covoiturage.aires
SET geom = ST_SetSRID(ST_Point(xlong,ylat),4326);