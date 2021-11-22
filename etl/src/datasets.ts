import { datasets as perimDatasets, StaticMigrable } from '@betagouvpdc/perimeters';
import { CreateAiresCovoiturageTable } from './datastructure/002_CreateAiresCovoiturageTable';
import { CreateRegistreCovoiturageTable } from './datastructure/003_CreateRegistreCovoiturageTable';
import { TransportAires2021 } from './datasets/transport_data_gouv/aires_covoiturage/2021/TransportAires2021';
import RpcJourneys  from  './datasets/rpc/journeys/RpcJourneys';
import { getFilesUrl } from './helpers';
import { Datasets } from './interfaces/RpcJourneysInterface'

export async function datasets():Promise<Datasets>{
  const datasets:Set<StaticMigrable> = perimDatasets.datasets;
  datasets.add(CreateAiresCovoiturageTable);
  datasets.add(CreateRegistreCovoiturageTable);
  datasets.add(TransportAires2021);
  const urls = await getFilesUrl('https://www.data.gouv.fr/api/1/datasets/trajets-realises-en-covoiturage-registre-de-preuve-de-covoiturage/');
  for (const url of urls) {
    const year = parseInt(url.slice(-11,-7));
    const month = parseInt(url.slice(-6,-4));
    datasets.add(RpcJourneys(year,month,url));
  }
  return datasets;
}

