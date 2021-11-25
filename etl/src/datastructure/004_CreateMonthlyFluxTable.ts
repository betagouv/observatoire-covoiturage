import { AbstractDatastructure } from '@betagouvpdc/perimeters';

export class CreateMonthlyFluxTable extends AbstractDatastructure {
  static uuid = 'create_monthly_flux_table';
  static table = 'monthly_flux';
  readonly indexWithSchema = this.tableWithSchema.replace('.', '_');
  readonly sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableWithSchema} (
        id SERIAL PRIMARY KEY,
        year smallint NOT NULL,
        month smallint NOT NULL,
        type varchar NOT NULL,
        territory_1 varchar NOT NULL,
        territory_2 varchar NOT NULL,
        journeys integer NOT NULL,
        passengers integer NOT NULL,
        sum_distance float NOT NULL,
        sum_duration float NOT NULL
      );
      CREATE INDEX IF NOT EXISTS ${this.indexWithSchema}_id_index ON ${this.tableWithSchema} USING btree (id);

      CREATE OR REPLACE FUNCTION import_monthly_flux(from_table varchar, year int, month int) 
      RETURNS VOID LANGUAGE 'plpgsql' AS $PROC$
      DECLARE
      sql text;
      BEGIN
      sql := 'INSERT INTO public.monthly_flux (
        year,
        month,
        type,
        territory_1,
        territory_2,
        journeys,
        passengers,
        sum_distance,
        sum_duration
      ) 
      SELECT 
      '|| $2 ||',
      '|| $3 ||',
      ''com'',
      LEAST(b.com, c.com),
      GREATEST(b.com, c.com),
      count(trip_id),
      sum(passenger_seats),
      sum(journey_distance)::float/1000,
      sum(journey_duration)::float/60
      FROM '|| $1 ||' a
      LEFT JOIN perimeters b ON a.journey_start_insee=b.arr and b.year = '|| $2 ||'
      LEFT JOIN perimeters c ON a.journey_end_insee=c.arr and c.year = '|| $2 ||'
      GROUP BY LEAST(b.com, c.com), GREATEST(b.com, c.com)
      HAVING (LEAST(b.com, c.com)) IS NOT NULL OR (GREATEST(b.com, c.com)) IS NOT NULL
      UNION
      SELECT 
      '|| $2 ||',
      '|| $3 ||',
      ''epci'',
      LEAST(b.epci, c.epci),
      GREATEST(b.epci, c.epci),
      count(trip_id),
      sum(passenger_seats),
      sum(journey_distance)::float/1000,
      sum(journey_duration)::float/60
      FROM '|| $1 ||' a
      LEFT JOIN perimeters b ON a.journey_start_insee=b.arr and b.year = '|| $2 ||'
      LEFT JOIN perimeters c ON a.journey_end_insee=c.arr and c.year = '|| $2 ||'
      GROUP BY LEAST(b.epci, c.epci), GREATEST(b.epci, c.epci)
      HAVING (LEAST(b.epci, c.epci)) IS NOT NULL OR (GREATEST(b.epci, c.epci)) IS NOT NULL
      UNION
      SELECT 
      '|| $2 ||',
      '|| $3 ||',
      ''aom'',
      LEAST(b.aom, c.aom),
      GREATEST(b.aom, c.aom),
      count(trip_id),
      sum(passenger_seats),
      sum(journey_distance)::float/1000,
      sum(journey_duration)::float/60
      FROM '|| $1 ||' a
      LEFT JOIN perimeters b ON a.journey_start_insee=b.arr and b.year = '|| $2 ||'
      LEFT JOIN perimeters c ON a.journey_end_insee=c.arr and c.year = '|| $2 ||'
      GROUP BY LEAST(b.aom, c.aom), GREATEST(b.aom, c.aom)
      HAVING (LEAST(b.aom, c.aom)) IS NOT NULL OR (GREATEST(b.aom, c.aom)) IS NOT NULL
      UNION
      SELECT 
      '|| $2 ||',
      '|| $3 ||',
      ''dep'',
      LEAST(b.dep, c.dep),
      GREATEST(b.dep, c.dep),
      count(trip_id),
      sum(passenger_seats),
      sum(journey_distance)::float/1000,
      sum(journey_duration)::float/60
      FROM '|| $1 ||' a
      LEFT JOIN perimeters b ON a.journey_start_insee=b.arr and b.year = '|| $2 ||'
      LEFT JOIN perimeters c ON a.journey_end_insee=c.arr and c.year = '|| $2 ||'
      GROUP BY LEAST(b.dep, c.dep), GREATEST(b.dep, c.dep)
      HAVING (LEAST(b.dep, c.dep)) IS NOT NULL OR (GREATEST(b.dep, c.dep)) IS NOT NULL
      UNION
      SELECT 
      '|| $2 ||',
      '|| $3 ||',
      ''reg'',
      LEAST(b.reg, c.reg),
      GREATEST(b.reg, c.reg),
      count(trip_id),
      sum(passenger_seats),
      sum(journey_distance)::float/1000,
      sum(journey_duration)::float/60
      FROM '|| $1 ||' a
      LEFT JOIN perimeters b ON a.journey_start_insee=b.arr and b.year = '|| $2 ||'
      LEFT JOIN perimeters c ON a.journey_end_insee=c.arr and c.year = '|| $2 ||'
      GROUP BY LEAST(b.reg, c.reg), GREATEST(b.reg, c.reg)
      HAVING (LEAST(b.reg, c.reg)) IS NOT NULL OR (GREATEST(b.reg, c.reg)) IS NOT NULL
      UNION
      SELECT 
      '|| $2 ||',
      '|| $3 ||',
      ''country'',
      LEAST(b.country, c.country),
      GREATEST(b.country, c.country),
      count(trip_id),
      sum(passenger_seats),
      sum(journey_distance)::float/1000,
      sum(journey_duration)::float/60
      FROM '|| $1 ||' a
      LEFT JOIN perimeters b ON a.journey_start_insee=b.arr and b.year = '|| $2 ||'
      LEFT JOIN perimeters c ON a.journey_end_insee=c.arr and c.year = '|| $2 ||'
      GROUP BY LEAST(b.country, c.country), GREATEST(b.country, c.country)
      HAVING (LEAST(b.country, c.country)) IS NOT NULL OR (GREATEST(b.country, c.country)) IS NOT NULL;';
      EXECUTE sql;
      END
      $PROC$;
    `;
}