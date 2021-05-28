CREATE MATERIALIZED VIEW IF NOT EXISTS covoiturage.journeys_monthly_origin_occupation_rate_epci AS
WITH journeys AS (
  SELECT trip_id,
	to_char(registre.journey_start_datetime, 'YYYY') AS year,
    to_char(registre.journey_start_datetime, 'MM') AS month,
    CASE
      WHEN length(registre.journey_start_insee) = 4 THEN '0'||registre.journey_start_insee
      ELSE registre.journey_start_insee
    END AS origin,
    1 AS journey,
    CASE
      WHEN registre.passenger_seats IS NULL THEN 1
      ELSE registre.passenger_seats
    END AS passengers
  FROM covoiturage.registre
  WHERE trip_id IS NOT NULL
),
passage AS (
SELECT com,epci,l_epci
FROM perimeters.communes_2021 a
UNION
SELECT insee_cog as com,insee_cog as epci, name as l_epci
FROM perimeters.countries
),
geometry AS (
SELECT epci,l_epci,ST_PointOnSurface(geom) as geom
FROM perimeters.epci_2021
UNION
SELECT insee_cog as epci,name as l_epci, ST_PointOnSurface(geom) as geom
FROM perimeters.countries
)
SELECT row_number() OVER (ORDER BY a.year, a.month, c.epci) AS id, a.year, a.month,c.epci,c.l_epci, sum(a.journey) as journeys, sum(a.passengers) as passengers,round(((sum(passengers)::numeric/count(distinct trip_id))+1),2) as occupation_rate,c.geom
FROM journeys a
LEFT JOIN passage b ON a.origin=b.com
LEFT JOIN geometry c ON b.epci = c.epci
GROUP BY a.year, a.month,c.epci,c.l_epci,c.geom;

CREATE INDEX IF NOT EXISTS journeys_monthly_origin_occupation_rate_epci_id_index ON covoiturage.journeys_monthly_origin_occupation_rate_epci USING btree (id);