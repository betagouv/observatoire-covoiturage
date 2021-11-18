import { AbstractDataset, ArchiveFileTypeEnum, FileTypeEnum } from '@betagouvpdc/perimeters';

export class TransportAires2021 extends AbstractDataset {
  static producer = 'transport_data_gouv';
  static dataset = 'aires_covoiturage';
  static year = 2021;
  static table = 'aires_covoiturage_2021';
  readonly targetTable = 'aires_covoiturage';

  readonly url: string = 'https://raw.githubusercontent.com/etalab/transport-base-nationale-covoiturage/main/bnlc-.csv';
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.None;
  readonly rows: Map<string, [string, string]> = new Map([
    ['id_lieu', ['0', 'varchar']],
    ['nom_lieu', ['1', 'varchar']],
    ['ad_lieu', ['2', 'varchar']],
    ['com_lieu', ['3', 'varchar']],
    ['insee', ['4', 'varchar']],
    ['type', ['5', 'varchar']],
    ['date_maj', ['6', 'date']],
    ['ouvert', ['7', 'boolean']],
    ['source', ['8', 'varchar']],
    ['xlong', ['9', 'varchar']],
    ['ylat', ['10', 'varchar']],
    ['nbre_pl', ['11', 'varchar']],
    ['nbre_pmr', ['12', 'varchar']],
    ['duree', ['13', 'varchar']],
    ['horaires', ['14', 'varchar']],
    ['proprio', ['15', 'varchar']],
    ['lumiere', ['16', 'varchar']],
    ['comm', ['17', 'varchar']],
  ]);
  fileType: FileTypeEnum = FileTypeEnum.Csv;
  sheetOptions = {};

  readonly importSql = `
    INSERT INTO ${this.targetTableWithSchema} (
      year,
      id_lieu,
      nom_lieu,
      ad_lieu,
      com_lieu,
      insee,
      type,
      date_maj,
      ouvert,
      source,
      xlong,
      ylat,
      nbre_pl,
      nbre_pmr,
      duree,
      horaires,
      proprio,
      lumiere,
      comm,
      geom
    ) SELECT
      2021,
      id_lieu,
      nom_lieu,
      ad_lieu,
      com_lieu,
      insee,
      type,
      date_maj,
      ouvert,
      source,
      xlong,
      ylat,
      nbre_pl,
      nbre_pmr,
      duree,
      horaires,
      proprio,
      lumiere,
      comm,
      ST_SetSRID(ST_Point(trim(xlong,chr(160))::float,trim(ylat,chr(160))::float),4326)
    FROM ${this.tableWithSchema} 
    ON CONFLICT DO NOTHING;
  `;
}
