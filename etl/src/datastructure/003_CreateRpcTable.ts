import { AbstractDatastructure } from '@betagouvpdc/evolution-geo';

export class CreateRpcTable extends AbstractDatastructure {
  static uuid = 'create_rpc_table';
  static table = 'rpc';
  readonly indexWithSchema = this.tableWithSchema.replace('.', '_');
  readonly sql = `
      DROP TABLE IF EXISTS ${this.tableWithSchema};
      CREATE TABLE IF NOT EXISTS ${this.tableWithSchema} (
        id SERIAL PRIMARY KEY,
        journey_id varchar UNIQUE,
        trip_id varchar,
        journey_start_date date,
        journey_start_time time without time zone,
        journey_start_lat float,
        journey_start_lon float,
        journey_start_insee varchar(5),
        journey_end_date date,
        journey_end_time time without time zone,
        journey_end_lat float,
        journey_end_lon float,
        journey_end_insee varchar(5),
        journey_distance integer,
        journey_duration integer,
        passenger_seats integer,
        operator_class varchar(1),
        has_incentive boolean
      );
      CREATE INDEX IF NOT EXISTS ${this.indexWithSchema}_id_index ON ${this.tableWithSchema} USING btree (id);
    `;
}
