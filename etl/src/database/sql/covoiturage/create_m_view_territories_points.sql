CREATE MATERIALIZED VIEW IF NOT EXISTS perimeters.territories_points AS
WITH territories_2021 AS (
SELECT '2021' AS year, com as territory,l_com as l_territory,'com'::varchar as type,geom
FROM perimeters.chefs_lieux_2021
UNION
SELECT '2021' AS year, epci as territory,l_epci as l_territory,'epci'::varchar as type,ST_PointOnSurface(geom) as geom
FROM perimeters.epci_2021
UNION
SELECT '2021' AS year, dep as territory,l_dep as l_territory,'dep'::varchar as type,ST_PointOnSurface(geom) as geom
FROM perimeters.departements
UNION
SELECT '2021' AS year, reg as territory,l_reg as l_territory,'reg'::varchar as type,ST_PointOnSurface(geom) as geom
FROM perimeters.regions
UNION
SELECT '2021' AS year, insee_cog as territory,name as l_territory,'country'::varchar as type, ST_PointOnSurface(geom) as geom
FROM perimeters.countries
WHERE insee_cog <> 'XXXXX' OR name = 'FRANCE'
ORDER BY type,territory
),
territories_2020 AS (
SELECT '2020' AS year, com as territory,l_com as l_territory,'com'::varchar as type,geom
FROM perimeters.chefs_lieux_2020
UNION
SELECT '2020' AS year, epci as territory,l_epci as l_territory,'epci'::varchar as type,ST_PointOnSurface(geom) as geom
FROM perimeters.epci_2020
UNION
SELECT '2020' AS year, dep as territory,l_dep as l_territory,'dep'::varchar as type,ST_PointOnSurface(geom) as geom
FROM perimeters.departements
UNION
SELECT '2020' AS year, reg as territory,l_reg as l_territory,'reg'::varchar as type,ST_PointOnSurface(geom) as geom
FROM perimeters.regions
UNION
SELECT '2020' AS year, insee_cog as territory,name as l_territory,'country'::varchar as type, ST_PointOnSurface(geom) as geom
FROM perimeters.countries
WHERE insee_cog <> 'XXXXX' OR name = 'FRANCE'
ORDER BY type,territory
),
all_territories AS (
  SELECT * FROM territories_2020
  UNION
  SELECT * FROM territories_2021
)

SELECT row_number() OVER () AS id,* from all_territories;

CREATE INDEX IF NOT EXISTS territories_points_id_index ON perimeters.territories_points USING btree (id);
CREATE INDEX IF NOT EXISTS territories_points_geom_index ON perimeters.territories_points USING gist (geom);