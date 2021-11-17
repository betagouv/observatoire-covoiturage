import { CreateGeoTable } from '@betagouvpdc/perimeters/dist/datastructure/000_CreateGeoTable';
import { CreateComEvolutionTable } from '@betagouvpdc/perimeters/dist/datastructure/001_CreateComEvolutionTable';
import { CreateAiresCovoiturageTable } from './datastructure/002_CreateAiresCovoiturageTable';
import { CreateRegistreCovoiturageTable } from './datastructure/003_CreateRegistreCovoiturageTable';
import { IgnAe2019 } from '@betagouvpdc/perimeters/dist/datasets/ign/admin_express/2019/IgnAe2019';
import { IgnAe2020 } from '@betagouvpdc/perimeters/dist/datasets/ign/admin_express/2020/IgnAe2020';
import { IgnAe2021 } from '@betagouvpdc/perimeters/dist/datasets/ign/admin_express/2021/IgnAe2021';
import { EurostatCountries2020 } from '@betagouvpdc/perimeters/dist/datasets/eurostat/countries/2020/EurostatCountries2020';
import { InseePerim2019 } from '@betagouvpdc/perimeters/dist/datasets/insee/perimetres/2019/InseePerim2019';
import { InseePerim2020 } from '@betagouvpdc/perimeters/dist/datasets/insee/perimetres/2020/InseePerim2020';
import { InseePerim2021 } from '@betagouvpdc/perimeters/dist/datasets/insee/perimetres/2021/InseePerim2021';
import { InseeDep2021 } from '@betagouvpdc/perimeters/dist/datasets/insee/departements/2021/InseeDep2021';
import { InseeReg2021 } from '@betagouvpdc/perimeters/dist/datasets/insee/regions/2021/InseeReg2021';
import { InseePays2021 } from '@betagouvpdc/perimeters/dist/datasets/insee/pays/2021/InseePays2021';
import { CeremaAom2019 } from '@betagouvpdc/perimeters/dist/datasets/cerema/aom/2019/CeremaAom2019';
import { CeremaAom2020 } from '@betagouvpdc/perimeters/dist/datasets/cerema/aom/2020/CeremaAom2020';
import { CeremaAom2021 } from '@betagouvpdc/perimeters/dist/datasets/cerema/aom/2021/CeremaAom2021';
import { DgclBanatic2021 } from '@betagouvpdc/perimeters/dist/datasets/dgcl/banatic/2021/DgclBanatic2021';
import { InseeMvtcom2021 } from '@betagouvpdc/perimeters/dist/datasets/insee/mvt_communaux/2021/InseeMvtcom2021';
import { StaticMigrable } from '@betagouvpdc/perimeters';
import { InseeCom2021 } from '@betagouvpdc/perimeters/dist/datasets/insee/communes/2021/InseeCom2021';
import { TransportAires2021 } from './datasets/transport_data_gouv/aires_covoiturage/2021/TransportAires2021';

export const datasets: Set<StaticMigrable> = new Set([
  CreateGeoTable,
  CreateComEvolutionTable,
  CreateAiresCovoiturageTable,
  CreateRegistreCovoiturageTable,
  IgnAe2019,
  IgnAe2020,
  IgnAe2021,
  EurostatCountries2020,
  InseeCom2021,
  InseePerim2019,
  InseePerim2020,
  InseePerim2021,
  InseeDep2021,
  InseeReg2021,
  InseePays2021,
  CeremaAom2019,
  CeremaAom2020,
  CeremaAom2021,
  DgclBanatic2021,
  InseeMvtcom2021,
  TransportAires2021,
]);