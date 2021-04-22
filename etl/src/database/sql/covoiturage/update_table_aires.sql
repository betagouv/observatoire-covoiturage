UPDATE covoiturage.aires
SET geom = ST_SetSRID(ST_Point(trim(xlong,chr(160))::float,trim(ylat,chr(160))::float),4326);