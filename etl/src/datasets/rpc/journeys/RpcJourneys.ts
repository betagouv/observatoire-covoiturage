import { AbstractDataset, ArchiveFileTypeEnum, FileTypeEnum } from '@betagouvpdc/perimeters';
import { DownloadError } from '@betagouvpdc/perimeters/dist/errors';
import { StaticRpcJourneysDataset } from '../../../interfaces/RpcJourneysInterface';
import { getRpcDatasetUuid } from '../../../helpers';
import axios from 'axios';

export class RpcJourneys extends AbstractDataset {
  static get uuid(): string {
    const self = this as unknown as StaticRpcJourneysDataset;
    return getRpcDatasetUuid(self.producer, self.dataset, self.year, self.month);
  }
  static producer = 'rpc';
  static dataset = 'journeys';
  static year = 2021;
  static table = 'registre_covoiturage_2021';
  readonly targetTable = 'registre_covoiturage';
  readonly url: string =
    'https://www.data.gouv.fr/api/1/datasets/trajets-realises-en-covoiturage-registre-de-preuve-de-covoiturage/';
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.None;
  readonly rows: Map<string, [string, string]> = new Map([
    ['journey_id', ['0', 'varchar']],
    ['trip_id', ['1', 'varchar']],
    ['journey_start_datetime', ['2', 'timestamp']],
    ['journey_start_lat', ['5', 'float']],
    ['journey_start_lon', ['6', 'float']],
    ['journey_start_insee', ['7', 'varchar']],
    ['journey_end_datetime', ['12', 'timestamp']],
    ['journey_end_lat', ['15', 'float']],
    ['journey_end_lon', ['16', 'float']],
    ['journey_end_insee', ['17', 'varchar']],
    ['journey_distance', ['24', 'integer']],
    ['journey_duration', ['25', 'integer']],
    ['passenger_seats', ['22', 'integer']],
    ['operator_class', ['23', 'varchar']],
  ]);
  fileType: FileTypeEnum = FileTypeEnum.Csv;
  sheetOptions = {
    delimiter: ';',
  };
  urls: string[] = [];

  async getFilesUrl(): Promise<void> {
    const response = await axios.get(this.url);
    for (const resource of response.data.resources) {
      if (resource.title.indexOf('vf') < 0) {
        this.urls.push(resource.url);
      }
    }
  }

  async download(): Promise<void> {
    try {
      await this.getFilesUrl();
      const filepaths: string[] = [];
      for (const url of this.urls) {
        const filepath = await this.file.download(url);
        if (this.fileArchiveType !== ArchiveFileTypeEnum.None) {
          filepaths.push(...(await this.file.decompress(filepath, this.fileArchiveType, this.fileType)));
        } else {
          filepaths.push(filepath);
        }
      }
      this.filepaths = filepaths;
    } catch (e) {
      throw new DownloadError(this, (e as Error).message);
    }
  }

  readonly importSql = `
    INSERT INTO ${this.targetTableWithSchema} (
      journey_id,
      trip_id,
      journey_start_datetime,
      journey_start_lat,
      journey_start_lon,
      journey_start_insee,
      journey_end_datetime,
      journey_end_lat,
      journey_end_lon,
      journey_end_insee,
      journey_distance,
      journey_duration,
      passenger_seats,
      operator_class
    ) SELECT
      journey_id,
      trip_id,
      journey_start_datetime,
      journey_start_lat,
      journey_start_lon,
      journey_start_insee,
      journey_end_datetime,
      journey_end_lat,
      journey_end_lon,
      journey_end_insee,
      journey_distance,
      journey_duration,
      passenger_seats,
      operator_class
    FROM ${this.tableWithSchema} 
    ON CONFLICT DO NOTHING;
  `;
}
