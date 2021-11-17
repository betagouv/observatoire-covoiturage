import { buildApp, defaultConfig } from '@betagouvpdc/perimeters';
import { datasets } from './datasets'

import * as dotenv from 'dotenv';

async function main(): Promise<void> {
  dotenv.config();
  defaultConfig.pool.host = process.env.POSTGRES_HOST || '127.0.0.1';
  defaultConfig.app.migrations = datasets;
  const migrator = buildApp(defaultConfig);
  await migrator.prepare();
  await migrator.run();
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});