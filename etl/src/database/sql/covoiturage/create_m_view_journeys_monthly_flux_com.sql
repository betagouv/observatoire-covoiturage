CREATE MATERIALIZED VIEW IF NOT EXISTS covoiturage.journeys_monthly_flux_com AS
WITH journeys AS (
  SELECT to_char(registre.journey_start_datetime, 'YYYY') AS year,
    to_char(registre.journey_start_datetime, 'MM') AS month,
    CASE
      WHEN length(registre.journey_start_insee) = 4 THEN '0'||registre.journey_start_insee
      ELSE registre.journey_start_insee
    END AS origin,
    CASE
      WHEN length(registre.journey_end_insee) = 4 THEN '0'||registre.journey_end_insee
      ELSE registre.journey_end_insee
    END AS destination,
    1 AS journey,
    CASE
      WHEN registre.passenger_seats IS NULL THEN 1
      ELSE registre.passenger_seats
    END AS passengers
  FROM covoiturage.registre
),
flux AS (
  SELECT journeys.year,
    journeys.month,
    LEAST(journeys.origin, journeys.destination) AS com1,
    GREATEST(journeys.origin, journeys.destination) AS com2,
    sum(journeys.journey) AS journeys,
    sum(journeys.passengers) AS passengers
    FROM journeys
  GROUP BY journeys.year, journeys.month, (LEAST(journeys.origin, journeys.destination)), (GREATEST(journeys.origin, journeys.destination))
),
geometries AS (
  SELECT '2021' AS year,
    chefs_lieux_2021.com,
    chefs_lieux_2021.l_com,
    chefs_lieux_2021.geom
    FROM perimeters.chefs_lieux_2021
UNION
  SELECT '2021' AS year,
    countries.insee_cog AS com,
    countries.name AS l_com,
    st_quantizecoordinates(st_pointonsurface(countries.geom), 1) AS geom
    FROM perimeters.countries
UNION
  SELECT '2020' AS year,
    chefs_lieux_2020.com,
    chefs_lieux_2020.l_com,
    chefs_lieux_2020.geom
    FROM perimeters.chefs_lieux_2020
UNION
  SELECT '2020' AS year,
    countries.insee_cog AS com,
    countries.name AS l_com,
    st_quantizecoordinates(st_pointonsurface(countries.geom), 1) AS geom
    FROM perimeters.countries
UNION
  SELECT '2019' AS year,
    chefs_lieux_2019.com,
    chefs_lieux_2019.l_com,
    chefs_lieux_2019.geom
    FROM perimeters.chefs_lieux_2019
UNION
  SELECT '2019' AS year,
    countries.insee_cog AS com,
    countries.name AS l_com,
    st_quantizecoordinates(st_pointonsurface(countries.geom), 1) AS geom
    FROM perimeters.countries
)
SELECT row_number() OVER (ORDER BY a.year, a.month, a.com1, a.com2) AS id,
a.year,
a.month,
a.com1,
b.l_com AS l_com1,
st_x(b.geom) AS com1_lng,
st_y(b.geom) AS com1_lat,
a.com2,
c.l_com AS l_com2,
st_x(c.geom) AS com2_lng,
st_y(c.geom) AS com2_lat,
a.journeys,
a.passengers
FROM flux a
LEFT JOIN geometries b ON a.com1 = b.com AND a.year = b.year
LEFT JOIN geometries c ON a.com2 = c.com AND a.year = c.year;

CREATE INDEX IF NOT EXISTS journeys_monthly_flux_com_id_index ON covoiturage.journeys_monthly_flux_com USING btree (id);