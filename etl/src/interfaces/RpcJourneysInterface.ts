import { StaticAbstractDataset } from '@betagouvpdc/perimeters';

export interface StaticRpcJourneysDataset extends StaticAbstractDataset {
  readonly month: number;
}
