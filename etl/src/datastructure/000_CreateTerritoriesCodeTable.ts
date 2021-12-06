import { AbstractDatastructure } from '@betagouvpdc/evolution-geo';

export class CreateTerritoriesCodeTable extends AbstractDatastructure {
  static uuid = 'create_territories_code_table';
  static table = 'territories_code';
  readonly indexWithSchema = this.tableWithSchema.replace('.', '_');
  readonly sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableWithSchema} (
        id SERIAL PRIMARY KEY,
        year smallint NOT NULL,
        l_arr VARCHAR(256) NOT NULL,
        arr VARCHAR(5) NOT NULL,
        l_com VARCHAR(256),
        com VARCHAR(5),
        l_epci VARCHAR(256),
        epci VARCHAR(9),
        l_aom VARCHAR(256),
        aom VARCHAR(9),
        l_dep VARCHAR(256),
        dep VARCHAR(3),
        l_reg VARCHAR(256),
        reg VARCHAR(2),
        l_country VARCHAR(256),
        country VARCHAR(5) NOT NULL
      );
      CREATE INDEX IF NOT EXISTS ${this.indexWithSchema}_id_index ON ${this.tableWithSchema} USING btree (id);
    `;
}
