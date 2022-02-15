import { AbstractDataset } from '@betagouvpdc/evolution-geo';
import { SqlError } from '@betagouvpdc/evolution-geo/dist/errors';
import { FileTypeEnum, ArchiveFileTypeEnum } from '@betagouvpdc/evolution-geo/dist/interfaces';
import { loadFileAsString } from '@betagouvpdc/evolution-geo/dist/helpers';

export enum OperationEnum {
  Insert = 'insert',
  Update = 'update',
  Delete = 'delete',
}

export interface TransformationInterface {
  op: OperationEnum;
  values: {};
  geometries?: {};
  conditions?: {};
}

export abstract class UpdateDataset extends AbstractDataset {
  fileType: FileTypeEnum = FileTypeEnum.Csv;
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.None;
  readonly rows: Map<string, [string, string]> = new Map();
  readonly url: string = '';

  abstract readonly transformations: Array<TransformationInterface>;

  async before(): Promise<void> {
    try {
      const sql = this.beforeSql
        ? this.beforeSql
        : this.beforeSqlPath
        ? await loadFileAsString(this.beforeSqlPath)
        : '';
      console.debug(sql);
      await this.connection.query(sql);
    } catch (e) {
      throw new SqlError(this, (e as Error).message);
    }
  }

  async download(): Promise<void> {}

  async transform(): Promise<void> {}

  async load(): Promise<void> {}

  async import(): Promise<void> {
    try {
      let query = '';
      for await (const { op, values, geometries, conditions } of this.transformations) {
        if (op === OperationEnum.Insert) {
          query = `INSERT INTO ${this.targetTableWithSchema}(
            ${Object.keys(values).join(',\n')}
            ${geometries ? `,${Object.keys(geometries).join(',\n')}` : ''}
          )
          SELECT * FROM (VALUES(${Object.values(values).join(',\n')})) as t
          ${geometries ? `,${Object.values(geometries).join(',\n')}` : ''}
          ;`;
        } else if (op === OperationEnum.Update) {
          query = `UPDATE ${this.targetTableWithSchema} SET 
            ${Object.keys(values)
              .map((v) => {
                return `${v} = new.${v}`;
              })
              .join(',\n')}
            ${
              geometries
                ? `, ${Object.keys(geometries)
                    .map((v) => {
                      return `${v} = new.${v}`;
                    })
                    .join(',\n')}`
                : ''
            }
          FROM (
            SELECT * FROM (VALUES(${Object.values(values).join(',\n')})) as t(${Object.keys(values).join(',\n')})
            ${geometries ? `,${Object.values(geometries).join(',\n')}` : ''}
          ) AS new
          ${
            conditions
              ? ` WHERE ${Object.entries(conditions)
                  .map(([k, v]) => {
                    return `${this.targetTable}.${k} = ${v}`;
                  })
                  .join('\nAND\n')}`
              : ''
          };`;
        } else if (op === OperationEnum.Delete) {
          query = `DELETE FROM  ${this.targetTableWithSchema}
          ${
            conditions
              ? ` WHERE ${Object.entries(conditions)
                  .map(([k, v]) => {
                    return `${k} = ${v}`;
                  })
                  .join('\nAND\n')}`
              : ''
          };`;
        }
        console.debug(query);
        await this.connection.query(query);
      }
    } catch (e) {
      throw new SqlError(this, (e as Error).message);
    }
  }
}
