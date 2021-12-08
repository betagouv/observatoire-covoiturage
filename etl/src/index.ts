import * as dotenv from 'dotenv';
dotenv.config();
import { buildMigrator } from '@betagouvpdc/evolution-geo';
import { datasets } from './datasets';

async function main(): Promise<void> {
  const obsDatasets = await datasets();
  const migrator = buildMigrator({
    app: { migrations: obsDatasets },
  });
  await migrator.prepare();
  await migrator.run();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
