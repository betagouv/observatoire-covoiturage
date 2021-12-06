import { StaticAbstractDataset } from '@betagouvpdc/evolution-geo';

export interface StaticRpcJourneysDataset extends StaticAbstractDataset {
  readonly month: number;
}
