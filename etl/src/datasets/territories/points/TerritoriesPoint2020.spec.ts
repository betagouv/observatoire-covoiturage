import anyTest, { TestInterface } from 'ava';
import { Pool } from 'pg';
import { MemoryStateManager } from '@betagouvpdc/evolution-geo/dist/providers';
import { Migrator, DatasetInterface } from '@betagouvpdc/evolution-geo';
import { createPool, createFileManager } from '@betagouvpdc/evolution-geo/dist/helpers/';
import { CreateTerritoriesPointTable } from '../../../datastructure/001_CreateTerritoriesPointTable';
import { TerritoriesPoint2020 } from './TerritoriesPoint2020';

interface TestContext {
  migrator: Migrator;
  connection: Pool;
  dataset: DatasetInterface;
}

const test = anyTest as TestInterface<TestContext>;
const Dataset = TerritoriesPoint2020;
const table = TerritoriesPoint2020.table;
test.before(async (t) => {
  t.context.connection = createPool({
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'local',
    host: process.env.POSTGRES_HOST || 'postgres',
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
  });
  t.context.migrator = new Migrator(t.context.connection, createFileManager(), {
    targetSchema: 'public',
    migrations: new Set([CreateTerritoriesPointTable, Dataset]),
    noCleanup: false,
  });
  t.context.dataset = new Dataset(t.context.connection, createFileManager(), 'public');
  await t.context.connection.query(`
    DROP TABLE IF EXISTS ${table}
  `);
  await t.context.migrator.prepare();
});

test.after.always(async (t) => {
  await t.context.connection.query(`
    DROP TABLE IF EXISTS ${table}
  `);
});

test.serial('should validate', async (t) => {
  await t.notThrowsAsync(() => t.context.dataset.validate(new MemoryStateManager()));
});

test.serial('should prepare', async (t) => {
  await t.notThrowsAsync(() => t.context.dataset.before());
});

test.serial('should load', async (t) => {
  await t.notThrowsAsync(() => t.context.dataset.load());
});

test.serial('should import', async (t) => {
  await t.context.migrator.run();
  const response = await t.context.connection.query(`
      SELECT count(*) FROM (SELECT 1 FROM ${table} LIMIT 1) AS t;
    `);
  t.is(response.rows[0].count, '1');
});

test.serial('should cleanup', async (t) => {
  await t.context.dataset.after();
  const query = `DELETE FROM ${table} WHERE year = 2020`;
  await t.throwsAsync(() => t.context.connection.query(query));
});
