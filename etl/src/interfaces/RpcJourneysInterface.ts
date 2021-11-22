import { StaticAbstractDataset, StaticMigrable } from '@betagouvpdc/perimeters/dist/interfaces/DatasetInterface'

export interface StaticRpcJourneysDataset extends StaticAbstractDataset {
  readonly month: number;
}

export type Datasets = Set<StaticMigrable>;