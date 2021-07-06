CREATE MATERIALIZED VIEW IF NOT EXISTS perimeters.territories_points AS
WITH territories AS (
SELECT com as territory,l_com as l_territory,'com'::varchar as type,geom
FROM perimeters.chefs_lieux_2021
UNION
SELECT epci as territory,l_epci as l_territory,'epci'::varchar as type,ST_PointOnSurface(geom) as geom
FROM perimeters.epci_2021
UNION
SELECT dep as territory,l_dep as l_territory,'dep'::varchar as type,ST_PointOnSurface(geom) as geom
FROM perimeters.departements
UNION
SELECT reg as territory,l_reg as l_territory,'reg'::varchar as type,ST_PointOnSurface(geom) as geom
FROM perimeters.regions
UNION
SELECT insee_cog as territory,name as l_territory,'country'::varchar as type, ST_PointOnSurface(geom) as geom
FROM perimeters.countries
WHERE insee_cog <> 'XXXXX' OR name = 'FRANCE'
ORDER BY type,territory
)
SELECT row_number() OVER () AS id,* from territories;

CREATE INDEX IF NOT EXISTS territories_points_id_index ON perimeters.territories_points USING btree (id);
CREATE INDEX IF NOT EXISTS territories_points_geom_index ON perimeters.territories_points USING gist (geom);