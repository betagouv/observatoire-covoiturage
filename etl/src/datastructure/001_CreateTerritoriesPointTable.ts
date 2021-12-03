import { AbstractDatastructure } from '@betagouvpdc/perimeters';

export class CreateTerritoriesPointTable extends AbstractDatastructure {
  static uuid = 'create_territories_point_table';
  static table = 'territories_point';
  readonly indexWithSchema = this.tableWithSchema.replace('.', '_');
  readonly sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableWithSchema} (
        id SERIAL PRIMARY KEY,
        year integer NOT NULL,
        territory varchar NOT NULL,
        l_territory varchar NOT NULL,
        type varchar NOT NULL,
        geom geometry(POINT,4326) NOT NULL
      );
      CREATE INDEX IF NOT EXISTS ${this.indexWithSchema}_id_index ON ${this.tableWithSchema} USING btree (id);
      CREATE INDEX IF NOT EXISTS ${this.indexWithSchema}_geom_index ON ${this.tableWithSchema} USING gist (geom);
    `;
}
