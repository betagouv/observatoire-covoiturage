import { AbstractDatastructure } from '@betagouvpdc/perimeters';

export class CreateAiresCovoiturageTable extends AbstractDatastructure {
  static uuid = 'create_aires_covoiturage_table';
  static table = 'aires_covoiturage';
  readonly indexWithSchema = this.tableWithSchema.replace('.', '_');
  readonly sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableWithSchema} (
        id SERIAL PRIMARY KEY,
        year integer,
        id_lieu varchar,
        nom_lieu varchar,
        ad_lieu varchar,
        com_lieu varchar,
        insee varchar,
        type varchar,
        date_maj date,
        ouvert boolean,
        source varchar,
        xlong varchar,
        ylat varchar,
        nbre_pl varchar,
        nbre_pmr varchar,
        duree varchar,
        horaires varchar,
        proprio varchar,
        lumiere varchar,
        comm varchar,
        geom geometry(POINT,4326)
      );
      CREATE INDEX IF NOT EXISTS ${this.indexWithSchema}_id_index ON ${this.tableWithSchema} USING btree (id);
      CREATE INDEX IF NOT EXISTS ${this.indexWithSchema}_geom_index ON ${this.tableWithSchema} USING gist (geom);
    `;
}
