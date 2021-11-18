import { StaticAbstractDataset } from '@betagouvpdc/perimeters/dist/interfaces/DatasetInterface'

export interface StaticRpcJourneysDataset extends StaticAbstractDataset {
  readonly month: number;
}