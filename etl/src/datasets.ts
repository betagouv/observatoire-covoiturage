import { datasets as perimDatasets, StaticMigrable } from '@betagouvpdc/perimeters';
import { CreateTerritoriesCodeTable } from './datastructure/000_CreateTerritoriesCodeTable';
import { CreateTerritoriesPointTable } from './datastructure/001_CreateTerritoriesPointTable';
import { CreateAiresCovoiturageTable } from './datastructure/002_CreateAiresCovoiturageTable';
import { CreateRpcTable } from './datastructure/003_CreateRpcTable';
import { TerritoriesCode2020 } from './datasets/territories/codes/TerritoriesCode2020';
import { TerritoriesCode2021 } from './datasets/territories/codes/TerritoriesCode2021';
import { TerritoriesPoint2020 } from './datasets/territories/points/TerritoriesPoint2020';
import { TerritoriesPoint2021 } from './datasets/territories/points/TerritoriesPoint2021';
import { CreateMonthlyFluxTable } from './datastructure/004_CreateMonthlyFluxTable';
import { CreateMonthlyOccupationTable } from './datastructure/005_CreateMonthlyOccupationTable';
import { TransportAires2021 } from './datasets/transport_data_gouv/aires_covoiturage/2021/TransportAires2021';
import { rpcJourneys } from './datasets/rpc/journeys/RpcJourneys';
import { getFilesUrl } from './helpers';
import { Datasets } from './interfaces/DatasetsInterface';

export async function datasets(): Promise<Datasets> {
  const datasets: Set<StaticMigrable> = perimDatasets.datasets;
  datasets.add(CreateTerritoriesCodeTable);
  datasets.add(TerritoriesCode2020);
  datasets.add(TerritoriesCode2021);
  datasets.add(CreateTerritoriesPointTable);
  datasets.add(TerritoriesPoint2020);
  datasets.add(TerritoriesPoint2021);
  datasets.add(CreateAiresCovoiturageTable);
  datasets.add(TransportAires2021);
  datasets.add(CreateRpcTable);
  datasets.add(CreateMonthlyFluxTable);
  datasets.add(CreateMonthlyOccupationTable);
  const url =
    // eslint-disable-next-line max-len
    'https://www.data.gouv.fr/api/1/datasets/trajets-realises-en-covoiturage-registre-de-preuve-de-covoiturage/';
  const urls = await getFilesUrl(url);
  for (const url of urls) {
    const year = parseInt(url.slice(-11, -7));
    const month = parseInt(url.slice(-6, -4));
    datasets.add(rpcJourneys(year, month, url));
  }
  return datasets;
}
