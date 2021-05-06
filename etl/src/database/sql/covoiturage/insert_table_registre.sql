INSERT INTO covoiturage.registre (journey_id,trip_id,journey_start_datetime,journey_start_lat,journey_start_lon,journey_start_insee,journey_start_postcode,
journey_start_town,journey_start_country,journey_end_datetime,journey_end_lat,journey_end_lon,journey_end_insee,journey_end_postcode,journey_end_town,journey_end_country,
passenger_seats)
SELECT null::varchar as journey_id,null::varchar as trip_id,journey_start_datetime::timestamp,journey_start_lat::float,
journey_start_lon::float,journey_start_insee::varchar,journey_start_postcode::varchar,journey_start_town::varchar,
journey_start_country::varchar,journey_end_datetime::timestamp,journey_end_lat::float,journey_end_lon::float,journey_end_insee::varchar,
journey_end_postcode::varchar,journey_end_town::varchar,journey_end_country::varchar,null::integer as passenger_seats
FROM covoiturage.temp_2019_11_vf
UNION
SELECT null::varchar as journey_id,trip_id::varchar,journey_start_datetime::timestamp,journey_start_lat::float,
journey_start_lon::float,journey_start_insee::varchar,journey_start_postcode::varchar,journey_start_town::varchar,
journey_start_country::varchar,journey_end_datetime::timestamp,journey_end_lat::float,journey_end_lon::float,journey_end_insee::varchar,
journey_end_postcode::varchar,journey_end_town::varchar,journey_end_country::varchar,null::integer as passenger_seats
FROM covoiturage.temp_2019_12_vf
UNION
SELECT null::varchar as journey_id,trip_id::varchar,journey_start_datetime::timestamp,journey_start_lat::float,
journey_start_lon::float,journey_start_insee::varchar,journey_start_postcode::varchar,journey_start_town::varchar,
journey_start_country::varchar,journey_end_datetime::timestamp,journey_end_lat::float,journey_end_lon::float,journey_end_insee::varchar,
journey_end_postcode::varchar,journey_end_town::varchar,journey_end_country::varchar,null::integer as passenger_seats
FROM covoiturage.temp_2020_01_vf
UNION
SELECT null::varchar as journey_id,trip_id::varchar,journey_start_datetime::timestamp,journey_start_lat::float,
journey_start_lon::float,journey_start_insee::varchar,journey_start_postcode::varchar,journey_start_town::varchar,
journey_start_country::varchar,journey_end_datetime::timestamp,journey_end_lat::float,journey_end_lon::float,journey_end_insee::varchar,
journey_end_postcode::varchar,journey_end_town::varchar,journey_end_country::varchar,null::integer as passenger_seats
FROM covoiturage.temp_2020_02_vf
UNION
SELECT null::varchar as journey_id,trip_id::varchar,journey_start_datetime::timestamp,journey_start_lat::float,
journey_start_lon::float,journey_start_insee::varchar,journey_start_postcode::varchar,journey_start_town::varchar,
journey_start_country::varchar,journey_end_datetime::timestamp,journey_end_lat::float,journey_end_lon::float,journey_end_insee::varchar,
journey_end_postcode::varchar,journey_end_town::varchar,journey_end_country::varchar,null::integer as passenger_seats
FROM covoiturage.temp_2020_03_vf
UNION
SELECT journey_id::varchar,null::varchar as trip_id,journey_start_datetime::timestamp,journey_start_lat::float,
journey_start_lon::float,journey_start_insee::varchar,journey_start_postcode::varchar,journey_start_town::varchar,
journey_start_country::varchar,journey_end_datetime::timestamp,journey_end_lat::float,journey_end_lon::float,journey_end_insee::varchar,
journey_end_postcode::varchar,journey_end_town::varchar,journey_end_country::varchar,null::integer as passenger_seats
FROM covoiturage.temp_2020_04_vf
UNION
SELECT journey_id::varchar,null::varchar as trip_id,journey_start_datetime::timestamp,journey_start_lat::float,
journey_start_lon::float,journey_start_insee::varchar,journey_start_postcode::varchar,journey_start_town::varchar,
journey_start_country::varchar,journey_end_datetime::timestamp,journey_end_lat::float,journey_end_lon::float,journey_end_insee::varchar,
journey_end_postcode::varchar,journey_end_town::varchar,journey_end_country::varchar,null::integer as passenger_seats
FROM covoiturage.temp_2020_05_vf
UNION
SELECT journey_id::varchar,null::varchar as trip_id,journey_start_datetime::timestamp,journey_start_lat::float,
journey_start_lon::float,journey_start_insee::varchar,journey_start_postcode::varchar,journey_start_town::varchar,
journey_start_country::varchar,journey_end_datetime::timestamp,journey_end_lat::float,journey_end_lon::float,journey_end_insee::varchar,
journey_end_postcode::varchar,journey_end_town::varchar,journey_end_country::varchar,null::integer as passenger_seats
FROM covoiturage.temp_2020_06_vf
UNION
SELECT journey_id::varchar,null::varchar as trip_id,journey_start_datetime::timestamp,journey_start_lat::float,
journey_start_lon::float,journey_start_insee::varchar,journey_start_postcode::varchar,journey_start_town::varchar,
journey_start_country::varchar,journey_end_datetime::timestamp,journey_end_lat::float,journey_end_lon::float,journey_end_insee::varchar,
journey_end_postcode::varchar,journey_end_town::varchar,journey_end_country::varchar,null::integer as passenger_seats
FROM covoiturage.temp_2020_07_vf
UNION
SELECT journey_id::varchar,trip_id::varchar,journey_start_datetime::timestamp,journey_start_lat::float,
journey_start_lon::float,journey_start_insee::varchar,journey_start_postalcode::varchar as journey_start_postcode,journey_start_town::varchar,
journey_start_country::varchar,journey_end_datetime::timestamp,journey_end_lat::float,journey_end_lon::float,journey_end_insee::varchar,
journey_end_postalcode::varchar as journey_end_postcode,journey_end_town::varchar,journey_end_country::varchar,passenger_seats::integer
FROM covoiturage.temp_2020_08_vf
UNION
SELECT journey_id::varchar,trip_id::varchar,journey_start_datetime::timestamp,journey_start_lat::float,
journey_start_lon::float,journey_start_insee::varchar,journey_start_postalcode::varchar as journey_start_postcode,journey_start_town::varchar,
journey_start_country::varchar,journey_end_datetime::timestamp,journey_end_lat::float,journey_end_lon::float,journey_end_insee::varchar,
journey_end_postalcode::varchar as journey_end_postcode,null::varchar as journey_end_town,journey_end_country::varchar,passenger_seats::integer
FROM covoiturage.temp_2020_09_vf
UNION
SELECT journey_id::varchar,trip_id::varchar,journey_start_datetime::timestamp,journey_start_lat::float,
journey_start_lon::float,journey_start_insee::varchar,journey_start_postalcode::varchar as journey_start_postcode,journey_start_town::varchar,
journey_start_country::varchar,journey_end_datetime::timestamp,journey_end_lat::float,journey_end_lon::float,journey_end_insee::varchar,
journey_end_postalcode::varchar as journey_end_postcode,journey_end_town::varchar,journey_end_country::varchar,passenger_seats::integer
FROM covoiturage.temp_2020_10_vf
UNION
SELECT journey_id::varchar,trip_id::varchar,journey_start_datetime::timestamp,journey_start_lat::float,
journey_start_lon::float,journey_start_insee::varchar,journey_start_postalcode::varchar as journey_start_postcode,journey_start_town::varchar,
journey_start_country::varchar,journey_end_datetime::timestamp,journey_end_lat::float,journey_end_lon::float,journey_end_insee::varchar,
journey_end_postalcode::varchar as journey_end_postcode,journey_end_town::varchar,journey_end_country::varchar,passenger_seats::integer
FROM covoiturage.temp_2020_11_vf
UNION
SELECT journey_id::varchar,trip_id::varchar,journey_start_datetime::timestamp,journey_start_lat::float,
journey_start_lon::float,journey_start_insee::varchar,journey_start_postalcode::varchar as journey_start_postcode,journey_start_town::varchar,
journey_start_country::varchar,journey_end_datetime::timestamp,journey_end_lat::float,journey_end_lon::float,journey_end_insee::varchar,
journey_end_postalcode::varchar as journey_end_postcode,journey_end_town::varchar,journey_end_country::varchar,passenger_seats::integer
FROM covoiturage.temp_2020_12_vf
UNION
SELECT journey_id::varchar,trip_id::varchar,journey_start_datetime::timestamp,journey_start_lat::float,
journey_start_lon::float,journey_start_insee::varchar,journey_start_postalcode::varchar as journey_start_postcode,journey_start_town::varchar,
journey_start_country::varchar,journey_end_datetime::timestamp,journey_end_lat::float,journey_end_lon::float,journey_end_insee::varchar,
journey_end_postalcode::varchar as journey_end_postcode,journey_end_town::varchar,journey_end_country::varchar,passenger_seats::integer
FROM covoiturage.temp_2021_01_vf
UNION
SELECT journey_id::varchar,trip_id::varchar,journey_start_datetime::timestamp,journey_start_lat::float,
journey_start_lon::float,journey_start_insee::varchar,journey_start_postalcode::varchar as journey_start_postcode,journey_start_town::varchar,
journey_start_country::varchar,journey_end_datetime::timestamp,journey_end_lat::float,journey_end_lon::float,journey_end_insee::varchar,
journey_end_postalcode::varchar as journey_end_postcode,journey_end_town::varchar,journey_end_country::varchar,passenger_seats::integer
FROM covoiturage.temp_2021_02_vf
UNION
SELECT journey_id::varchar,trip_id::varchar,journey_start_datetime::timestamp,journey_start_lat::float,
journey_start_lon::float,journey_start_insee::varchar,journey_start_postalcode::varchar as journey_start_postcode,journey_start_town::varchar,
journey_start_country::varchar,journey_end_datetime::timestamp,journey_end_lat::float,journey_end_lon::float,journey_end_insee::varchar,
journey_end_postalcode::varchar as journey_end_postcode,journey_end_town::varchar,journey_end_country::varchar,passenger_seats::integer
FROM covoiturage.temp_2021_03_vf