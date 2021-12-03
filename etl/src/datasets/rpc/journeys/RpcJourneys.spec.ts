import anyTest, { TestInterface } from 'ava';
import { Pool } from 'pg';
import { MemoryStateManager } from '@betagouvpdc/perimeters/dist/providers';
import { Migrator, DatasetInterface } from '@betagouvpdc/perimeters';
import { createPool, createFileProvider } from '@betagouvpdc/perimeters/dist/helpers/';
import { CreateRpcTable } from '../../../datastructure/003_CreateRpcTable';
import { rpcJourneys } from './RpcJourneys';

interface TestContext {
  migrator: Migrator;
  connection: Pool;
  dataset: DatasetInterface;
}

const test = anyTest as TestInterface<TestContext>;
const url =
  // eslint-disable-next-line max-len
  'https://static.data.gouv.fr/resources/trajets-realises-en-covoiturage-registre-de-preuve-de-covoiturage/20211117-132803/2021-01.csv';
const Dataset = rpcJourneys(2021, 1, url);
const table = Dataset.table;
test.before(async (t) => {
  t.context.connection = createPool({
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'local',
    host: process.env.POSTGRES_HOST || 'postgres',
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
  });
  t.context.migrator = new Migrator(t.context.connection, createFileProvider(), {
    targetSchema: 'public',
    migrations: new Set([CreateRpcTable, Dataset]),
    noCleanup: false,
  });
  t.context.dataset = new Dataset(t.context.connection, createFileProvider(), 'public');
  await t.context.connection.query(`
      DROP TABLE IF EXISTS ${table}
    `);
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
  await t.context.dataset.before();
  const query = `SELECT * FROM ${table}`;
  t.log(query);
  await t.notThrowsAsync(() => t.context.connection.query(query));
});

test.serial('should download file', async (t) => {
  await t.notThrowsAsync(() => t.context.dataset.download());
});

test.serial('should transform', async (t) => {
  await t.notThrowsAsync(() => t.context.dataset.transform());
});

test.serial('should load', async (t) => {
  await t.context.dataset.load();
  const response = await t.context.connection.query(`
      SELECT count(*) FROM (SELECT 1 FROM ${table} LIMIT 1) AS t;
    `);
  t.is(response.rows[0].count, '1');
});

test.serial('should cleanup', async (t) => {
  await t.context.dataset.after();
  const query = `SELECT * FROM ${table}`;
  await t.throwsAsync(() => t.context.connection.query(query));
});