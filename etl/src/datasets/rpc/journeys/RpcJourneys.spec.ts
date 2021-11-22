import anyTest, { TestInterface } from 'ava';
import { access } from 'fs/promises';
import { Pool } from 'pg';
import { MemoryStateManager } from '@betagouvpdc/perimeters/dist/providers';
import { AbstractDataset } from '@betagouvpdc/perimeters';
import { createPool, createFileProvider } from '@betagouvpdc/perimeters/dist/helpers';
import RpcJourneys from './RpcJourneys';

interface TestContext {
  connection: Pool;
  dataset: AbstractDataset;
}

const test = anyTest as TestInterface<TestContext>;

/*test.before(async (t) => {
  t.context.connection = createPool({
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'local',
    host: process.env.POSTGRES_HOST || 'postgres',
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
  });
  t.context.dataset = new Dataset(t.context.connection, createFileProvider());
  await t.context.connection.query(`
      DROP TABLE IF EXISTS ${t.context.dataset.tableWithSchema}
    `);
});

test.after.always(async (t) => {
  await t.context.connection.query(`
    DROP TABLE IF EXISTS ${t.context.dataset.tableWithSchema}
  `);
});

test.serial('should validate', async (t) => {
  await t.notThrowsAsync(() => t.context.dataset.validate(new MemoryStateManager()));
});

test.serial('should prepare', async (t) => {
  await t.context.dataset.before();
  const query = `SELECT * FROM ${t.context.dataset.tableWithSchema}`;
  t.log(query);
  await t.notThrowsAsync(() => t.context.connection.query(query));
});

test.serial('should download file', async (t) => {
  await t.context.dataset.download();
  t.true(t.context.dataset.filepaths.length >= 1);
  for (const path of t.context.dataset.filepaths) {
    await t.notThrowsAsync(() => access(path));
  }
});

test.serial('should transform', async (t) => {
  await t.notThrowsAsync(() => t.context.dataset.transform());
});

test.serial('should load', async (t) => {
  await t.context.dataset.load();
  const response = await t.context.connection.query(`
      SELECT count(*) FROM (SELECT 1 FROM ${t.context.dataset.tableWithSchema} LIMIT 1) AS t;
    `);
  t.is(response.rows[0].count, '1');
});

test.serial('should cleanup', async (t) => {
  await t.context.dataset.after();
  const query = `SELECT * FROM ${t.context.dataset.tableWithSchema}`;
  await t.throwsAsync(() => t.context.connection.query(query));
});*/
