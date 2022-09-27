import { AbstractDatastructure } from '@betagouvpdc/evolution-geo';
import { CreateTerritoriesPointTable } from './001_CreateTerritoriesPointTable';

export class CreateMonthlyOccupationTable extends AbstractDatastructure {
  static uuid = 'create_monthly_occupation_table';
  static table = 'monthly_occupation';
  readonly indexWithSchema = this.tableWithSchema.replace('.', '_');
  readonly sql = `
      DROP TABLE IF EXISTS ${this.tableWithSchema};
      CREATE TABLE IF NOT EXISTS ${this.tableWithSchema} (
        id SERIAL PRIMARY KEY,
        year smallint NOT NULL,
        month smallint NOT NULL,
        type varchar NOT NULL,
        territory varchar NOT NULL,
        l_territory varchar NOT NULL,
        journeys integer NOT NULL,
        trips integer NOT NULL,
        has_incentive integer NOT NULL,
        occupation_rate float NOT NULL,
        geom json NOT NULL
      );
      CREATE INDEX IF NOT EXISTS ${this.indexWithSchema}_id_index ON ${this.tableWithSchema} USING btree (id);
      ALTER TABLE ${this.tableWithSchema} ADD CONSTRAINT ${this.table}_unique_key UNIQUE (year,month,type,territory);
      DROP PROCEDURE IF EXISTS ${this.targetSchema}.import_monthly_occupation;

      CREATE OR REPLACE PROCEDURE 
      ${this.targetSchema}.import_monthly_occupation(from_table varchar, year int, month int) 
      LANGUAGE 'plpgsql' 
      AS $$
      DECLARE
      sql text;
      BEGIN
      sql := '
      CREATE TEMP TABLE temp_occupation as (
        WITH perim as (
          SELECT territory,
          l_territory,
          type,
          geom
          FROM ${this.targetSchema}.${CreateTerritoriesPointTable.table}
          WHERE year = '|| $2 ||'
          UNION
          SELECT territory,
          l_territory,
          ''com'' as type,
          geom
          FROM ${this.targetSchema}.${CreateTerritoriesPointTable.table}
          WHERE year = '|| $2 ||'
          AND type = ''country''
          AND territory <>''XXXXX''
        ),
        journeys as (
          SELECT trip_id,
          journey_start_insee as insee,
          ''origin'' as one_way,
          journey_distance,
          passenger_seats,
          has_incentive
          FROM '|| $1 ||'
          UNION ALL
          SELECT trip_id,
          journey_end_insee as insee,
          ''destination'' as one_way,
          journey_distance,
          passenger_seats,
          has_incentive
          FROM '|| $1 ||'
        ),
        distances as(
          SELECT 
          trip_id,
          insee,
          (journey_distance * passenger_seats) as passengers_distance,
          CASE WHEN row_number() OVER (PARTITION BY(insee,trip_id) ORDER BY journey_distance desc) = 1 
          THEN journey_distance 
          ELSE 0 END as driver_distance,
          has_incentive
          from journeys
          ),
          sum_distances as (
          SELECT 
          ''com'' as type, 
          b.arr as territory,  
          count(trip_id) as journeys,
          count(distinct trip_id) as trips,
          count(trip_id) filter(where has_incentive = ''OUI'') as has_incentive, 
          sum(passengers_distance) as passengers_distance,
          sum(driver_distance) as driver_distance
          FROM distances a
          LEFT JOIN perimeters b ON a.insee=b.arr and b.year = '|| $2 ||' and b.com is not null
          GROUP BY b.arr
          HAVING b.arr IS NOT NULL
          UNION
          SELECT ''epci'' as type, 
          b.epci as territory, 
          count(trip_id) as journeys,
          count(distinct trip_id) as trips,
          count(trip_id) filter(where has_incentive = ''OUI'') as has_incentive,
          sum(passengers_distance) as passengers_distance,
          sum(driver_distance) as driver_distance
          FROM distances a
          LEFT JOIN perimeters b ON a.insee=b.arr and b.year = '|| $2 ||'
          GROUP BY b.epci, b.l_epci
          HAVING b.epci IS NOT NULL
          UNION
          SELECT ''aom'' as type, 
          b.aom as territory, 
          count(trip_id) as journeys,
          count(distinct trip_id) as trips,
          count(trip_id) filter(where has_incentive = ''OUI'') as has_incentive,
          sum(passengers_distance) as passengers_distance,
          sum(driver_distance) as driver_distance
          FROM distances a
          LEFT JOIN perimeters b ON a.insee=b.arr and b.year = '|| $2 ||'
          GROUP BY b.aom, b.l_aom
          HAVING b.aom IS NOT NULL
          UNION
          SELECT ''dep'' as type, 
          b.dep as territory,
          count(trip_id) as journeys,
          count(distinct trip_id) as trips,
          count(trip_id) filter(where has_incentive = ''OUI'') as has_incentive,
          sum(passengers_distance) as passengers_distance,
          sum(driver_distance) as driver_distance
          FROM distances a
          LEFT JOIN perimeters b ON a.insee=b.arr and b.year = '|| $2 ||'
          GROUP BY b.dep, b.l_dep
          HAVING b.dep IS NOT NULL
          UNION
          SELECT ''reg'' as type,
          b.reg as territory, 
          count(trip_id) as journeys,
          count(distinct trip_id) as trips,
          count(trip_id) filter(where has_incentive = ''OUI'') as has_incentive, 
          sum(passengers_distance) as passengers_distance,
          sum(driver_distance) as driver_distance
          FROM distances a
          LEFT JOIN perimeters b ON a.insee=b.arr and b.year = '|| $2 ||'
          GROUP BY b.reg, b.l_reg
          HAVING b.reg IS NOT NULL
          UNION
          SELECT ''country'' as type, 
          b.country as territory, 
          count(trip_id) as journeys,
          count(distinct trip_id) as trips,
          count(trip_id) filter(where has_incentive = ''OUI'') as has_incentive, 
          sum(passengers_distance) as passengers_distance,
          sum(driver_distance) as driver_distance
          FROM distances a
          LEFT JOIN perimeters b ON a.insee=b.arr and b.year = '|| $2 ||'
          GROUP BY b.country, b.l_country
          HAVING b.country IS NOT NULL
        )
        SELECT '|| $2 ||' as year,
        '|| $3 ||' as month,
        a.type,
        a.territory,
        b.l_territory,
        a.journeys,
        a.trips,
        a.has_incentive,
        round((a.passengers_distance + a.driver_distance)::numeric / a.driver_distance::numeric,2) as occupation_rate,
        ST_AsGeoJSON(b.geom,6)::json as geom 
        from sum_distances a
        LEFT JOIN perim b on a.territory=b.territory and a.type=b.type
        WHERE a.driver_distance <> 0
      );
      ';
      EXECUTE sql;
      INSERT INTO ${this.tableWithSchema} (
        year,
        month,
        type,
        territory,
        l_territory,
        journeys,
        has_incentive,
        occupation_rate,
        geom
      )
      SELECT * FROM temp_occupation
      ON CONFLICT 
      ON CONSTRAINT ${this.table}_unique_key
      DO NOTHING;
      DROP TABLE temp_occupation;
      END
      $$;
    `;
}
