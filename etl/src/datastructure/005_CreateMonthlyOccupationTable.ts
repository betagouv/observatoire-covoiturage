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
        occupation_rate float NOT NULL,
        geom json NOT NULL
      );
      CREATE INDEX IF NOT EXISTS ${this.indexWithSchema}_id_index ON ${this.tableWithSchema} USING btree (id);
      ALTER TABLE ${this.tableWithSchema} ADD CONSTRAINT ${this.table}_unique_key UNIQUE (year,month,type,territory);
      DROP FUNCTION IF EXISTS ${this.targetSchema}.import_monthly_occupation;

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
            '|| $2 ||' as year,
            '|| $3 ||' as month,
            journey_start_insee as insee,
            ''origin'' as one_way,
            passenger_seats as passengers
            FROM '|| $1 ||'
            UNION ALL
            SELECT trip_id,
            '|| $2 ||' as year,
            '|| $3 ||' as month,
            journey_end_insee as insee,
            ''destination'' as one_way,
            passenger_seats as passengers
            FROM '|| $1 ||'
          ),
          occupation_rate as (
            SELECT '|| $2 ||' as year,
            '|| $3 ||' as month, 
            ''com'' as type, 
            b.arr as territory, 
            b.l_arr as l_territory, 
            count(distinct trip_id) as journeys, 
            round(((sum(passengers)::numeric/count(distinct concat(trip_id,one_way)))+1),2) as occupation_rate
            FROM journeys a
            LEFT JOIN perimeters b ON a.insee=b.arr and b.year = '|| $2 ||' and b.com is not null
            GROUP BY b.arr, b.l_arr
            HAVING b.arr IS NOT NULL
            UNION
            SELECT '|| $2 ||' as year,
            '|| $3 ||' as month, 
            ''epci'' as type, 
            b.epci as territory, 
            b.l_epci as l_territory, 
            count(distinct trip_id) as journeys, 
            round(((sum(passengers)::numeric/count(distinct concat(trip_id,one_way)))+1),2) as occupation_rate
            FROM journeys a
            LEFT JOIN perimeters b ON a.insee=b.arr and b.year = '|| $2 ||'
            GROUP BY b.epci, b.l_epci
            HAVING b.epci IS NOT NULL
            UNION
            SELECT '|| $2 ||' as year,
            '|| $3 ||' as month, 
            ''aom'' as type, 
            b.aom as territory, 
            b.l_aom as l_territory, 
            count(distinct trip_id) as journeys, 
            round(((sum(passengers)::numeric/count(distinct concat(trip_id,one_way)))+1),2) as occupation_rate
            FROM journeys a
            LEFT JOIN perimeters b ON a.insee=b.arr and b.year = '|| $2 ||'
            GROUP BY b.aom, b.l_aom
            HAVING b.aom IS NOT NULL
            UNION
            SELECT '|| $2 ||' as year,
            '|| $3 ||' as month, 
            ''dep'' as type, 
            b.dep as territory,
            b.l_dep as l_territory, 
            count(distinct trip_id) as journeys, 
            round(((sum(passengers)::numeric/count(distinct concat(trip_id,one_way)))+1),2) as occupation_rate
            FROM journeys a
            LEFT JOIN perimeters b ON a.insee=b.arr and b.year = '|| $2 ||'
            GROUP BY b.dep, b.l_dep
            HAVING b.dep IS NOT NULL
            UNION
            SELECT '|| $2 ||' as year,
            '|| $3 ||' as month, 
            ''reg'' as type,
            b.reg as territory, 
            b.l_reg as l_territory, 
            count(distinct trip_id) as journeys, 
            round(((sum(passengers)::numeric/count(distinct concat(trip_id,one_way)))+1),2) as occupation_rate
            FROM journeys a
            LEFT JOIN perimeters b ON a.insee=b.arr and b.year = '|| $2 ||'
            GROUP BY b.reg, b.l_reg
            HAVING b.reg IS NOT NULL
            UNION
            SELECT '|| $2 ||' as year,
            '|| $3 ||' as month, 
            ''country'' as type, 
            b.country as territory, 
            b.l_country as l_territory, 
            count(distinct trip_id) as journeys, 
            round(((sum(passengers)::numeric/count(distinct concat(trip_id,one_way)))+1),2) as occupation_rate
            FROM journeys a
            LEFT JOIN perimeters b ON a.insee=b.arr and b.year = '|| $2 ||'
            GROUP BY b.country, b.l_country
            HAVING b.country IS NOT NULL
          )
          SELECT a.*,ST_AsGeoJSON(b.geom,6)::json as geom from occupation_rate a
          LEFT JOIN perim b on a.territory=b.territory and a.type=b.type
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
