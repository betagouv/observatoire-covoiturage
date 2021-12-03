import { AbstractDatastructure } from '@betagouvpdc/perimeters';

export class CreateRpcTable extends AbstractDatastructure {
  static uuid = 'create_rpc_table';
  static table = 'rpc';
  readonly indexWithSchema = this.tableWithSchema.replace('.', '_');
  readonly sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableWithSchema} (
        id SERIAL PRIMARY KEY,
        journey_id varchar UNIQUE,
        trip_id varchar,
        journey_start_date date,
        journey_start_lat float,
        journey_start_lon float,
        journey_start_insee varchar(5),
        journey_end_date date,
        journey_end_lat float,
        journey_end_lon float,
        journey_end_insee varchar(5),
        journey_distance integer,
        journey_duration integer,
        passenger_seats integer,
        operator_class varchar(1)
      );
      CREATE INDEX IF NOT EXISTS ${this.indexWithSchema}_id_index ON ${this.tableWithSchema} USING btree (id);
    `;
}