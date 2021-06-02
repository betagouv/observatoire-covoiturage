CREATE MATERIALIZED VIEW IF NOT EXISTS covoiturage.journeys_monthly_occupation_rate_dep AS
WITH journeys AS (
  SELECT trip_id,
	to_char(registre.journey_start_datetime, 'YYYY') AS year,
    to_char(registre.journey_start_datetime, 'MM') AS month,
    CASE
      WHEN length(registre.journey_start_insee) = 4 THEN '0'||registre.journey_start_insee
      ELSE registre.journey_start_insee
    END AS com,
    1 AS journey,
    'origin' as one_way,
    CASE
      WHEN registre.passenger_seats IS NULL THEN 1
      ELSE registre.passenger_seats
    END AS passengers
  FROM covoiturage.registre
  WHERE trip_id IS NOT NULL
  UNION ALL
	SELECT trip_id,
	to_char(registre.journey_start_datetime, 'YYYY') AS year,
    to_char(registre.journey_start_datetime, 'MM') AS month,
	CASE
      WHEN length(registre.journey_end_insee) = 4 THEN '0'||registre.journey_end_insee
      ELSE registre.journey_end_insee
    END AS com,
    1 AS journey,
    'destination' as one_way,
    CASE
      WHEN registre.passenger_seats IS NULL THEN 1
      ELSE registre.passenger_seats
    END AS passengers
  FROM covoiturage.registre
  WHERE trip_id IS NOT NULL
),
passage AS (
SELECT com,dep
FROM perimeters.communes_2021 a
UNION
SELECT insee_cog as com,insee_cog as dep
FROM perimeters.countries
),
geometry AS (
SELECT dep,l_dep,ST_PointOnSurface(geom) as geom
FROM perimeters.departements
UNION
SELECT insee_cog as dep,name as l_dep, ST_PointOnSurface(geom) as geom
FROM perimeters.countries
)
SELECT row_number() OVER (ORDER BY a.year, a.month, c.dep) AS id, a.year, a.month,c.dep as territory,c.l_dep as l_territory, sum(a.journey) as journeys, sum(a.passengers) as passengers,round(((sum(passengers)::numeric/count(distinct concat(trip_id,one_way)))+1),2) as occupation_rate,c.geom
FROM journeys a
LEFT JOIN passage b ON a.com=b.com
LEFT JOIN geometry c ON b.dep = c.dep
GROUP BY a.year, a.month,c.dep,c.l_dep,c.geom;

CREATE INDEX IF NOT EXISTS journeys_monthly_occupation_rate_dep_id_index ON covoiturage.journeys_monthly_occupation_rate_dep USING btree (id);