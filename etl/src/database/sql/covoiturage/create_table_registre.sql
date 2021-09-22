DROP TABLE IF EXISTS covoiturage.registre CASCADE;
CREATE TABLE IF NOT EXISTS covoiturage.registre (
  id SERIAL PRIMARY KEY,
  journey_id varchar,
  trip_id varchar,
  journey_start_datetime timestamp,
  journey_start_lat float,
  journey_start_lon float,
  journey_start_insee varchar(5),
  journey_start_postcode varchar,
  journey_start_town varchar,
  journey_start_country varchar,
  journey_end_datetime timestamp,
  journey_end_lat float,
  journey_end_lon float,
  journey_end_insee varchar(5),
  journey_end_postcode varchar,
  journey_end_town varchar,
  journey_end_country varchar,
  passenger_seats integer
);
CREATE INDEX registre_id_index ON covoiturage.registre USING btree (id);