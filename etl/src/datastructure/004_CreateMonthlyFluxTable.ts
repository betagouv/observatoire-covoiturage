import { AbstractDatastructure } from '@betagouvpdc/evolution-geo';
import { CreateTerritoriesPointTable } from './001_CreateTerritoriesPointTable';

export class CreateMonthlyFluxTable extends AbstractDatastructure {
  static uuid = 'create_monthly_flux_table';
  static table = 'monthly_flux';
  readonly indexWithSchema = this.tableWithSchema.replace('.', '_');
  readonly sql = `
      DROP TABLE IF EXISTS ${this.tableWithSchema};
      CREATE TABLE IF NOT EXISTS ${this.tableWithSchema} (
        id SERIAL PRIMARY KEY,
        year smallint NOT NULL,
        month smallint NOT NULL,
        type varchar NOT NULL,
        territory_1 varchar NOT NULL,
        l_territory_1 varchar NOT NULL,
        lng_1 float NOT NULL,
        lat_1 float NOT NULL,
        territory_2 varchar NOT NULL,
        l_territory_2 varchar NOT NULL,
        lng_2 float NOT NULL,
        lat_2 float NOT NULL,
        journeys integer NOT NULL,
        passengers integer NOT NULL,
        distance float NOT NULL,
        duration float NOT NULL
      );
      CREATE INDEX IF NOT EXISTS ${this.indexWithSchema}_id_index ON ${this.tableWithSchema} USING btree (id);
      ALTER TABLE ${this.tableWithSchema} ADD CONSTRAINT ${this.table}_unique_key UNIQUE (year,month,type,territory_1,territory_2);

      CREATE OR REPLACE FUNCTION ${this.targetSchema}.import_monthly_flux(from_table varchar, year int, month int) 
      RETURNS VOID LANGUAGE 'plpgsql' AS $PROC$
      DECLARE
      sql text;
      BEGIN
      sql := 'INSERT INTO ${this.tableWithSchema} (
        year,
        month,
        type,
        territory_1,
        l_territory_1,
        lng_1,
        lat_1,
        territory_2,
        l_territory_2,
        lng_2,
        lat_2,
        journeys,
        passengers,
        distance,
        duration
      )
      WITH perim as (
        SELECT territory,
        l_territory,
        type,
        ROUND(st_x(geom)::numeric,6) as lng,
        ROUND(st_y(geom)::numeric,6) as lat
        FROM ${this.targetSchema}.${CreateTerritoriesPointTable.table}
        WHERE year = '|| $2 ||'
        UNION
        SELECT territory,
        l_territory,
        ''com'' as type,
        ROUND(st_x(geom)::numeric,6) as lng,
        ROUND(st_y(geom)::numeric,6) as lat
        FROM ${this.targetSchema}.${CreateTerritoriesPointTable.table}
        WHERE year = '|| $2 ||'
        AND type = ''country''
        AND territory <>''XXXXX''
      ),
      flux as ( 
        SELECT 
        '|| $2 ||' as year,
        '|| $3 ||' as month,
        ''com'' as type,
        LEAST(b.arr, c.arr) as territory_1,
        GREATEST(b.arr, c.arr) as territory_2,
        count(trip_id) as journeys,
        sum(passenger_seats) as passengers,
        round(sum(journey_distance)::numeric/1000,2) as distance,
        round(sum(journey_duration)::numeric/60,2) as duration
        FROM '|| $1 ||' a
        LEFT JOIN perimeters b ON a.journey_start_insee=b.arr and b.year = '|| $2 ||'
        LEFT JOIN perimeters c ON a.journey_end_insee=c.arr and c.year = '|| $2 ||'
        GROUP BY LEAST(b.arr, c.arr), GREATEST(b.arr, c.arr)
        HAVING (LEAST(b.arr, c.arr)) IS NOT NULL OR (GREATEST(b.arr, c.arr)) IS NOT NULL
        UNION
        SELECT 
        '|| $2 ||' as year,
        '|| $3 ||' as month,
        ''epci'' as type,
        LEAST(b.epci, c.epci) as territory_1,
        GREATEST(b.epci, c.epci) as territory_2,
        count(trip_id) as journeys,
        sum(passenger_seats) as passengers,
        round(sum(journey_distance)::numeric/1000,2) as distance,
        round(sum(journey_duration)::numeric/60,2) as duration
        FROM '|| $1 ||' a
        LEFT JOIN perimeters b ON a.journey_start_insee=b.arr and b.year = '|| $2 ||'
        LEFT JOIN perimeters c ON a.journey_end_insee=c.arr and c.year = '|| $2 ||'
        GROUP BY LEAST(b.epci, c.epci), GREATEST(b.epci, c.epci)
        HAVING (LEAST(b.epci, c.epci)) IS NOT NULL OR (GREATEST(b.epci, c.epci)) IS NOT NULL
        UNION
        SELECT 
        '|| $2 ||' as year,
        '|| $3 ||' as month,
        ''aom'' as type,
        LEAST(b.aom, c.aom) as territory_1,
        GREATEST(b.aom, c.aom) as territory_2,
        count(trip_id) as journeys,
        sum(passenger_seats) as passengers,
        round(sum(journey_distance)::numeric/1000,2) as distance,
        round(sum(journey_duration)::numeric/60,2) as duration
        FROM '|| $1 ||' a
        LEFT JOIN perimeters b ON a.journey_start_insee=b.arr and b.year = '|| $2 ||'
        LEFT JOIN perimeters c ON a.journey_end_insee=c.arr and c.year = '|| $2 ||'
        GROUP BY LEAST(b.aom, c.aom), GREATEST(b.aom, c.aom)
        HAVING (LEAST(b.aom, c.aom)) IS NOT NULL OR (GREATEST(b.aom, c.aom)) IS NOT NULL
        UNION
        SELECT 
        '|| $2 ||' as year,
        '|| $3 ||' as month,
        ''dep'' as type,
        LEAST(b.dep, c.dep) as territory_1,
        GREATEST(b.dep, c.dep) as territory_2,
        count(trip_id) as journeys,
        sum(passenger_seats) as passengers,
        round(sum(journey_distance)::numeric/1000,2) as distance,
        round(sum(journey_duration)::numeric/60,2) as duration
        FROM '|| $1 ||' a
        LEFT JOIN perimeters b ON a.journey_start_insee=b.arr and b.year = '|| $2 ||'
        LEFT JOIN perimeters c ON a.journey_end_insee=c.arr and c.year = '|| $2 ||'
        GROUP BY LEAST(b.dep, c.dep), GREATEST(b.dep, c.dep)
        HAVING (LEAST(b.dep, c.dep)) IS NOT NULL OR (GREATEST(b.dep, c.dep)) IS NOT NULL
        UNION
        SELECT 
        '|| $2 ||' as year,
        '|| $3 ||' as month,
        ''reg'' as type,
        LEAST(b.reg, c.reg) as territory_1,
        GREATEST(b.reg, c.reg) as territory_2,
        count(trip_id) as journeys,
        sum(passenger_seats) as passengers,
        round(sum(journey_distance)::numeric/1000,2) as distance,
        round(sum(journey_duration)::numeric/60,2) as duration
        FROM '|| $1 ||' a
        LEFT JOIN perimeters b ON a.journey_start_insee=b.arr and b.year = '|| $2 ||'
        LEFT JOIN perimeters c ON a.journey_end_insee=c.arr and c.year = '|| $2 ||'
        GROUP BY LEAST(b.reg, c.reg), GREATEST(b.reg, c.reg)
        HAVING (LEAST(b.reg, c.reg)) IS NOT NULL OR (GREATEST(b.reg, c.reg)) IS NOT NULL
        UNION
        SELECT 
        '|| $2 ||' as year,
        '|| $3 ||' as month,
        ''country'' as type,
        LEAST(b.country, c.country) as territory_1,
        GREATEST(b.country, c.country) as territory_2,
        count(trip_id) as journeys,
        sum(passenger_seats) as passengers,
        round(sum(journey_distance)::numeric/1000,2) as distance,
        round(sum(journey_duration)::numeric/60,2) as duration
        FROM '|| $1 ||' a
        LEFT JOIN perimeters b ON a.journey_start_insee=b.arr and b.year = '|| $2 ||'
        LEFT JOIN perimeters c ON a.journey_end_insee=c.arr and c.year = '|| $2 ||'
        GROUP BY LEAST(b.country, c.country), GREATEST(b.country, c.country)
        HAVING (LEAST(b.country, c.country)) IS NOT NULL OR (GREATEST(b.country, c.country)) IS NOT NULL
      )
      SELECT a.year, a.month, a.type, a.territory_1, b.l_territory, b.lng, b.lat, 
      a.territory_2, c.l_territory,c.lng, c.lat, 
      a.journeys, a.passengers, a.distance, a.duration 
      FROM flux a
      LEFT JOIN perim b on concat(a.territory_1,a.type) = concat(b.territory,b.type) 
      LEFT JOIN perim c on concat(a.territory_2,a.type) = concat(c.territory,c.type)
      ORDER BY a.territory_1,a.territory_2
      ON CONFLICT 
      ON CONSTRAINT ${this.table}_unique_key
      DO NOTHING;';
      EXECUTE sql;
      END
      $PROC$;
    `;
}
