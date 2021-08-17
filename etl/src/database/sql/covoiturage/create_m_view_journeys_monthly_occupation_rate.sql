CREATE MATERIALIZED VIEW IF NOT EXISTS covoiturage.journeys_monthly_occupation_rate AS
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
occupation_rate as (
SELECT a.year, a.month,b.com as territory,'com'::varchar as type, sum(a.journey) as journeys, sum(a.passengers) as passengers,round(((sum(passengers)::numeric/count(distinct concat(trip_id,one_way)))+1),2) as occupation_rate
FROM journeys a
LEFT JOIN perimeters.communes_2021 b ON a.com=b.com
GROUP BY a.year, a.month,b.com
HAVING b.com IS NOT NULL
UNION
SELECT a.year, a.month,b.epci as territory,'epci'::varchar as type, sum(a.journey) as journeys, sum(a.passengers) as passengers,round(((sum(passengers)::numeric/count(distinct concat(trip_id,one_way)))+1),2) as occupation_rate
FROM journeys a
LEFT JOIN perimeters.communes_2021 b ON a.com=b.com
GROUP BY a.year, a.month,b.epci
HAVING b.epci IS NOT NULL
UNION
SELECT a.year, a.month,b.dep as territory,'dep'::varchar as type, sum(a.journey) as journeys, sum(a.passengers) as passengers,round(((sum(passengers)::numeric/count(distinct concat(trip_id,one_way)))+1),2) as occupation_rate
FROM journeys a
LEFT JOIN perimeters.communes_2021 b ON a.com=b.com
GROUP BY a.year, a.month,b.dep
HAVING b.dep IS NOT NULL
UNION
SELECT a.year, a.month,b.reg as territory,'reg'::varchar as type, sum(a.journey) as journeys, sum(a.passengers) as passengers,round(((sum(passengers)::numeric/count(distinct concat(trip_id,one_way)))+1),2) as occupation_rate
FROM journeys a
LEFT JOIN perimeters.communes_2021 b ON a.com=b.com
GROUP BY a.year, a.month,b.reg
HAVING b.reg IS NOT NULL
UNION
SELECT a.year, a.month, COALESCE(b.insee_cog,'XXXXX')  as territory,'country'::varchar as type, sum(a.journey) as journeys, sum(a.passengers) as passengers,round(((sum(passengers)::numeric/count(distinct concat(trip_id,one_way)))+1),2) as occupation_rate
FROM journeys a
LEFT JOIN perimeters.countries b ON a.com=b.insee_cog
GROUP BY a.year, a.month,COALESCE(b.insee_cog,'XXXXX')
)
SELECT row_number() OVER (ORDER BY year, month, type, territory) AS id,* from occupation_rate;

CREATE INDEX IF NOT EXISTS journeys_monthly_occupation_rate_id_index ON covoiturage.journeys_monthly_occupation_rate USING btree (id);