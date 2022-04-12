import { AbstractDataset, ArchiveFileTypeEnum, FileTypeEnum, StaticMigrable } from '@betagouvpdc/evolution-geo';
import { StaticRpcJourneysDataset } from '../../../interfaces/RpcJourneysInterface';
import { getRpcDatasetUuid } from '../../../helpers';

export function rpcJourneys(year: number, month: number, url: string): StaticMigrable {
  return class extends AbstractDataset {
    static get uuid(): string {
      const self = this as unknown as StaticRpcJourneysDataset;
      return getRpcDatasetUuid(self.producer, self.dataset, self.year, self.month);
    }
    static producer = 'rpc';
    static dataset = 'journeys';
    static year = year;
    static month = month;
    static table = `rpc_${year}_${month}`;
    readonly targetTable = 'rpc';
    readonly url = url;
    readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.None;
    readonly rows: Map<string, [string, string]> = new Map([
      ['journey_id', ['journey_id', 'varchar']],
      ['trip_id', ['trip_id', 'varchar']],
      ['journey_start_date', ['journey_start_date', 'date']],
      ['journey_start_time', ['journey_start_time', 'time without time zone']],
      ['journey_start_lon', ['journey_start_lon', 'float']],
      ['journey_start_lat', ['journey_start_lat', 'float']],
      ['journey_start_insee', ['journey_start_insee', 'varchar']],
      ['journey_end_date', ['journey_end_date', 'date']],
      ['journey_end_time', ['journey_end_time', 'time without time zone']],
      ['journey_end_lon', ['journey_end_lon', 'float']],
      ['journey_end_lat', ['journey_end_lat', 'float']],
      ['journey_end_insee', ['journey_end_insee', 'varchar']],
      ['passenger_seats', ['passenger_seats', 'integer']],
      ['operator_class', ['operator_class', 'varchar']],
      ['journey_distance', ['journey_distance', 'integer']],
      ['journey_duration', ['journey_duration', 'integer']],
      ['has_incentive', ['has_incentive', 'varchar']],
    ]);
    fileType: FileTypeEnum = FileTypeEnum.Csv;
    sheetOptions = {
      delimiter: ';',
      columns: true,
    };
    readonly importSql = `
      INSERT INTO ${this.targetTableWithSchema} (
        journey_id,
        trip_id,
        journey_start_date,
        journey_start_time,
        journey_start_lat,
        journey_start_lon,
        journey_start_insee,
        journey_end_date,
        journey_end_time,
        journey_end_lat,
        journey_end_lon,
        journey_end_insee,
        journey_distance,
        journey_duration,
        passenger_seats,
        operator_class,
        has_incentive
      ) SELECT
        journey_id,
        trip_id,
        journey_start_date,
        journey_start_time,
        journey_start_lat,
        journey_start_lon,
        journey_start_insee,
        journey_end_date,
        journey_end_time,
        journey_end_lat,
        journey_end_lon,
        journey_end_insee,
        journey_distance,
        journey_duration,
        passenger_seats,
        operator_class,
        CASE WHEN has_incentive = 'OUI' THEN true ELSE false END AS has_incentive
      FROM ${this.tableWithSchema} 
      ON CONFLICT 
      ON CONSTRAINT ${this.targetTable}_journey_id_key
      DO NOTHING;
    `;
    readonly afterSql = `
     CALL import_monthly_flux('${this.tableWithSchema}', ${year}, ${month});
     CALL import_monthly_occupation('${this.tableWithSchema}', ${year}, ${month});
     DROP TABLE IF EXISTS ${this.tableWithSchema};
    `;
  };
}
