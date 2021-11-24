import { AbstractDatastructure } from '@betagouvpdc/perimeters';

export class CreateMonthlyFluxTable extends AbstractDatastructure {
  static uuid = 'create_monthly_flux_table';
  static table = 'monthly_flux';
  readonly indexWithSchema = this.tableWithSchema.replace('.', '_');
  readonly sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableWithSchema} (
        id SERIAL PRIMARY KEY,
        year varchar(4) NOT NULL,
        month varchar(2) NOT NULL,
        type varchar NOT NULL,
        territory_1 varchar NOT NULL,
        territory_2 varchar NOT NULL,
        journeys integer NOT NULL,
        passengers integer NOT NULL,
        sum_distance integer NOT NULL,
        sum_duration integer NOT NULL
      );
      CREATE INDEX IF NOT EXISTS ${this.indexWithSchema}_id_index ON ${this.tableWithSchema} USING btree (id);

      CREATE OR REPLACE FUNCTION import_monthly_flux(from_table varchar, year int) RETURNS VOID AS
      $$
      BEGIN
        INSERT INTO ${this.tableWithSchema} (
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
        extract(YEAR from a.journey_start_datetime)::int AS year,
        extract(MONTH from a.journey_start_datetime)::int AS month,
        'com'::varchar as type,
        LEAST(b.arr, c.arr) AS territory_1,
        GREATEST(b.arr, c.arr) AS territory_2,
        count(trip_id) as journeys,
        sum(passenger_seats) AS passengers,
        sum(journey_distance) AS sum_distance,
        sum(journey_duration) AS sum_duration
        FROM $1 a
        LEFT JOIN perimeters b ON a.journey_start_insee=b.arr and b.year = $2
        LEFT JOIN perimeters c ON a.journey_end_insee=c.arr and c.year = $2
        GROUP BY extract(YEAR from a.journey_start_datetime),
        extract(MONTH from a.journey_start_datetime),
        LEAST(b.arr, c.arr),
        GREATEST(b.arr, c.arr)
      END
      $$
      LANGUAGE 'sql';
    `;
}