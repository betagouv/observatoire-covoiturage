CREATE MATERIALIZED VIEW IF NOT EXISTS covoiturage.journeys_monthly_flux AS
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
  SELECT year, month, 'com'::varchar as type, LEAST(origin, destination) AS territory_1, GREATEST(origin, destination) AS territory_2, sum(journey) AS journeys, sum(passengers) AS passengers
  FROM journeys 
  GROUP BY year, month, (LEAST(origin, destination)), (GREATEST(origin, destination))
  UNION
  SELECT a.year, a.month, 'epci'::varchar as type, LEAST(b.epci, c.epci) AS territory_1, GREATEST(b.epci, c.epci) AS territory_2, sum(journey) AS journeys, sum(passengers) AS passengers
  FROM journeys a
  LEFT JOIN perimeters.communes_2021 b ON a.origin=b.com
  LEFT JOIN perimeters.communes_2021 c ON a.destination=c.com
  GROUP BY year, month, (LEAST(b.epci, c.epci)), (GREATEST(b.epci, c.epci))
  HAVING (LEAST(b.epci, c.epci)) IS NOT NULL OR (GREATEST(b.epci, c.epci)) IS NOT NULL
  UNION
  SELECT a.year, a.month, 'dep'::varchar as type, LEAST(b.dep, c.dep) AS territory_1, GREATEST(b.dep, c.dep) AS territory_2, sum(journey) AS journeys, sum(passengers) AS passengers
  FROM journeys a
  LEFT JOIN perimeters.communes_2021 b ON a.origin=b.com
  LEFT JOIN perimeters.communes_2021 c ON a.destination=c.com
  GROUP BY year, month, (LEAST(b.dep, c.dep)), (GREATEST(b.dep, c.dep))
  HAVING (LEAST(b.dep, c.dep)) IS NOT NULL OR (GREATEST(b.dep, c.dep)) IS NOT NULL
  UNION
  SELECT a.year, a.month, 'reg'::varchar as type, LEAST(b.reg, c.reg) AS territory_1, GREATEST(b.reg, c.reg) AS territory_2, sum(journey) AS journeys, sum(passengers) AS passengers
  FROM journeys a
  LEFT JOIN perimeters.communes_2021 b ON a.origin=b.com
  LEFT JOIN perimeters.communes_2021 c ON a.destination=c.com
  GROUP BY year, month, (LEAST(b.reg, c.reg)), (GREATEST(b.reg, c.reg))
  HAVING (LEAST(b.reg, c.reg)) IS NOT NULL OR (GREATEST(b.reg, c.reg)) IS NOT NULL
  UNION
  SELECT a.year, a.month, 'country'::varchar as type, 
  LEAST(COALESCE(b.insee_cog,'XXXXX'), COALESCE(c.insee_cog,'XXXXX')) AS territory_1, GREATEST(COALESCE(b.insee_cog,'XXXXX'), COALESCE(c.insee_cog,'XXXXX')) AS territory_2, sum(journey) AS journeys, sum(passengers) AS passengers
  FROM journeys a
  LEFT JOIN perimeters.countries b ON a.origin=b.insee_cog
  LEFT JOIN perimeters.countries c ON a.destination=c.insee_cog
  GROUP BY year, month, LEAST(COALESCE(b.insee_cog,'XXXXX'), COALESCE(c.insee_cog,'XXXXX')), GREATEST(COALESCE(b.insee_cog,'XXXXX'), COALESCE(c.insee_cog,'XXXXX'))
)
SELECT row_number() OVER (ORDER BY year, month, type, territory_1, territory_2) AS id,* from flux 

CREATE INDEX IF NOT EXISTS journeys_monthly_flux_id_index ON covoiturage.journeys_monthly_flux USING btree (id);