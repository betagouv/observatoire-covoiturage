import { datasets as perimDatasets, StaticMigrable } from '@betagouvpdc/evolution-geo';
import { Perim2022 } from './datasets/manual/Perim2022';
import { CreateTerritoriesCodeTable } from './datastructure/000_CreateTerritoriesCodeTable';
import { CreateTerritoriesPointTable } from './datastructure/001_CreateTerritoriesPointTable';
import { CreateAiresCovoiturageTable } from './datastructure/002_CreateAiresCovoiturageTable';
import { CreateRpcTable } from './datastructure/003_CreateRpcTable';
import { CreateMonthlyFluxTable } from './datastructure/004_CreateMonthlyFluxTable';
import { CreateMonthlyOccupationTable } from './datastructure/005_CreateMonthlyOccupationTable';
import { TerritoriesCode2020 } from './datasets/territories/codes/TerritoriesCode2020';
import { TerritoriesCode2021 } from './datasets/territories/codes/TerritoriesCode2021';
import { TerritoriesCode2022 } from './datasets/territories/codes/TerritoriesCode2022';
import { TerritoriesPoint2020 } from './datasets/territories/points/TerritoriesPoint2020';
import { TerritoriesPoint2021 } from './datasets/territories/points/TerritoriesPoint2021';
import { TerritoriesPoint2022 } from './datasets/territories/points/TerritoriesPoint2022';
import { transportAires } from './datasets/transport_data_gouv/aires_covoiturage/TransportAires';
import { rpcJourneys } from './datasets/rpc/journeys/RpcJourneys';
import { getRpcFilesUrl, getAiresLastFileUrl } from './helpers';
import { Datasets } from './interfaces/DatasetsInterface';

export async function datasets(): Promise<Datasets> {
  const datasets: Set<StaticMigrable> = perimDatasets.datasets;
  datasets.add(Perim2022);
  datasets.add(CreateTerritoriesCodeTable);
  datasets.add(CreateTerritoriesPointTable);
  datasets.add(CreateAiresCovoiturageTable);
  datasets.add(CreateRpcTable);
  datasets.add(CreateMonthlyFluxTable);
  datasets.add(CreateMonthlyOccupationTable);
  datasets.add(TerritoriesCode2020);
  datasets.add(TerritoriesCode2021);
  datasets.add(TerritoriesCode2022);
  datasets.add(TerritoriesPoint2020);
  datasets.add(TerritoriesPoint2021);
  datasets.add(TerritoriesPoint2022);
 
  // add RPC migrations
  const rpcUrl =
    // eslint-disable-next-line max-len
    'https://www.data.gouv.fr/api/1/datasets/trajets-realises-en-covoiturage-registre-de-preuve-de-covoiturage/';
  const urls = await getRpcFilesUrl(rpcUrl);
  for (const url of urls) {
    const year = parseInt(url.slice(-11, -7));
    const month = parseInt(url.slice(-6, -4));
    datasets.add(rpcJourneys(year, month, url));
  }

  // add Aires migration
  const AiresUrl = 'https://transport.data.gouv.fr/api/datasets/5d6eaffc8b4c417cdc452ac3';
  const lastUrl = await getAiresLastFileUrl(AiresUrl);
  console.debug(lastUrl);
  datasets.add(transportAires(2022, lastUrl));

  return datasets;
}
