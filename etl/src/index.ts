import { buildMigrator } from '@betagouvpdc/evolution-geo';
import { datasets } from './datasets';

import * as dotenv from 'dotenv';

async function main(): Promise<void> {
  dotenv.config();
  const obsDatasets = await datasets();
  const migrator = buildMigrator({
    pool: { host: process.env.POSTGRES_HOST || '127.0.0.1' },
    app: { migrations: obsDatasets },
  });
  await migrator.prepare();
  await migrator.run();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
