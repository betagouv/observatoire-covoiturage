import {
  FileManagerInterface,
  DatasetInterface,
  StateManagerInterface,
  State,
  StaticAbstractDataset,
  StaticMigrable,
} from '@betagouvpdc/evolution-geo';
import { Pool } from 'pg';
import { SqlError, ValidationError } from '@betagouvpdc/evolution-geo/dist/errors';
import { getDatasetUuid, loadFileAsString } from '@betagouvpdc/evolution-geo/dist/helpers';

export abstract class AbstractDataAggregation implements DatasetInterface {
  static get uuid(): string {
    const self = this as unknown as StaticAbstractDataset;
    return getDatasetUuid(self.producer, self.dataset, self.year);
  }
  abstract readonly sql: string;
  readonly afterSql: string | undefined;
  readonly afterSqlPath: string | undefined;
  required: Set<StaticMigrable> = new Set();

  get table(): string {
    return (this.constructor as StaticAbstractDataset).table;
  }

  get targetTableWithSchema(): string {
    return `${this.targetSchema}.${this.table}`;
  }

  constructor(
    protected connection: Pool,
    protected file: FileManagerInterface,
    protected targetSchema: string = 'public',
  ) {}

  async validate(state: StateManagerInterface): Promise<void> {
    const done = state.get(State.Done);
    const difference = new Set([...this.required].filter((x) => !done.has(x)));
    if (difference.size > 0) {
      throw new ValidationError(
        this,
        `Cant apply this dataset, element is missing (${[...difference].map((d) => d.uuid).join(', ')})`,
      );
    }
  }

  async before(): Promise<void> {}

  async download(): Promise<void> {}

  async transform(): Promise<void> {}

  async load(): Promise<void> {}

  async import(): Promise<void> {
    try {
      await this.connection.query(this.sql);
    } catch (e) {
      throw new SqlError(this, (e as Error).message);
    }
  }

  async after(): Promise<void> {
    try {
      const generatedSql = '';
      const sql = this.afterSql
        ? this.afterSql
        : this.afterSqlPath
        ? await loadFileAsString(this.afterSqlPath)
        : generatedSql;
      await this.connection.query(sql);
    } catch (e) {
      throw new SqlError(this, (e as Error).message);
    }
  }
}
