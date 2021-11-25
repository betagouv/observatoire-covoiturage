import { datasets as perimDatasets, StaticMigrable } from '@betagouvpdc/perimeters';
import { CreateAiresCovoiturageTable } from './datastructure/002_CreateAiresCovoiturageTable';
import { CreateRpcTable } from './datastructure/003_CreateRpcTable';
import { CreateMonthlyFluxTable } from './datastructure/004_CreateMonthlyFluxTable';
import { TransportAires2021 } from './datasets/transport_data_gouv/aires_covoiturage/2021/TransportAires2021';
import { rpcJourneys } from './datasets/rpc/journeys/RpcJourneys';
import { getFilesUrl } from './helpers';
import { Datasets } from './interfaces/DatasetsInterface';

export async function datasets(): Promise<Datasets> {
  const datasets: Set<StaticMigrable> = perimDatasets.datasets;
  datasets.add(CreateAiresCovoiturageTable);
  datasets.add(CreateRpcTable);
  datasets.add(CreateMonthlyFluxTable);
  datasets.add(TransportAires2021);
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
