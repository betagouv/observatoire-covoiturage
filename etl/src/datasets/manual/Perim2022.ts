import { UpdateDataset, TransformationInterface, OperationEnum } from './common/UpdateDataset';
import { StaticAbstractDataset } from '@betagouvpdc/evolution-geo/dist/interfaces';

export class Perim2022 extends UpdateDataset {
  static producer = 'rpc';
  static dataset = 'perim';
  static year = 2022;
  static table = 'rpc_perim_2022';

  readonly beforeSql: string = `
    INSERT INTO ${this.targetTableWithSchema} (
      year, centroid, geom, geom_simple, l_arr, arr, l_com, com, l_epci, epci, l_dep, dep,
      l_reg, reg, l_country, country, l_aom, aom, l_reseau, reseau, pop, surface
    )
    SELECT ${(this.constructor as StaticAbstractDataset).year} as year,
    centroid,
    geom,
    geom_simple,
    l_arr,
    arr,
    l_com,
    com,
    l_epci,
    epci,
    l_dep,
    dep,
    l_reg,
    reg,
    l_country,
    country,
    l_aom,
    aom,
    l_reseau,
    reseau,
    pop,
    surface
    FROM ${this.targetTableWithSchema}
    WHERE year = 2021 
    AND arr NOT IN('02695','16010','19092','24089','24314','25134','25628','26219','56049','85307')
  `;
  readonly transformations: Array<TransformationInterface> = [
    {
      op: OperationEnum.Update,
      values: {
        year: 2022,
      },
      geometries: {
        geom: `(SELECT ST_MULTI(ST_UNION(geom)) AS geom 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2021 and arr IN('02695','02054')) as t1`,
        geom_simple: `(SELECT ST_MULTI(ST_UNION(geom_simple)) AS geom_simple 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2021 and arr IN('02695','02054')) as t2`,
      },
      conditions: {
        year: 2022,
        arr: `'02054'`,
      },
    },
    {
      op: OperationEnum.Update,
      values: {
        year: 2022,
      },
      geometries: {
        geom: `(SELECT ST_MULTI(ST_UNION(geom)) AS geom 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2021 and arr IN('16010','16186')) as t1`,
        geom_simple: `(SELECT ST_MULTI(ST_UNION(geom_simple)) AS geom_simple 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2021 and arr IN('16010','16186')) as t2`,
      },
      conditions: {
        year: 2022,
        arr: `'16186'`,
      },
    },
    {
      op: OperationEnum.Update,
      values: {
        year: 2022,
      },
      geometries: {
        geom: `(SELECT ST_MULTI(ST_UNION(geom)) AS geom 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2021 and arr IN('19092','19143')) as t1`,
        geom_simple: `(SELECT ST_MULTI(ST_UNION(geom_simple)) AS geom_simple 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2021 and arr IN('19092','19143')) as t2`,
      },
      conditions: {
        year: 2022,
        arr: `'19143'`,
      },
    },
    {
      op: OperationEnum.Update,
      values: {
        year: 2022,
      },
      geometries: {
        geom: `(SELECT ST_MULTI(ST_UNION(geom)) AS geom 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2021 and arr IN('24089','24314','24325')) as t1`,
        geom_simple: `(SELECT ST_MULTI(ST_UNION(geom_simple)) AS geom_simple 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2021 and arr IN('24089','24314','24325')) as t2`,
      },
      conditions: {
        year: 2022,
        arr: `'24325'`,
      },
    },
    {
      op: OperationEnum.Update,
      values: {
        year: 2022,
      },
      geometries: {
        geom: `(SELECT ST_MULTI(ST_UNION(geom)) AS geom 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2021 and arr IN('25134','25185')) as t1`,
        geom_simple: `(SELECT ST_MULTI(ST_UNION(geom_simple)) AS geom_simple 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2021 and arr IN('25134','25185')) as t2`,
      },
      conditions: {
        year: 2022,
        arr: `'25185'`,
      },
    },
    {
      op: OperationEnum.Update,
      values: {
        year: 2022,
      },
      geometries: {
        geom: `(SELECT ST_MULTI(ST_UNION(geom)) AS geom 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2021 and arr IN('25628','25375')) as t1`,
        geom_simple: `(SELECT ST_MULTI(ST_UNION(geom_simple)) AS geom_simple 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2021 and arr IN('25628','25375')) as t2`,
      },
      conditions: {
        year: 2022,
        arr: `'25375'`,
      },
    },
    {
      op: OperationEnum.Update,
      values: {
        year: 2022,
      },
      geometries: {
        geom: `(SELECT ST_MULTI(ST_UNION(geom)) AS geom 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2021 and arr IN('26219','26216')) as t1`,
        geom_simple: `(SELECT ST_MULTI(ST_UNION(geom_simple)) AS geom_simple 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2021 and arr IN('26219','26216')) as t2`,
      },
      conditions: {
        year: 2022,
        arr: `'26216'`,
      },
    },
    {
      op: OperationEnum.Update,
      values: {
        year: 2022,
      },
      geometries: {
        geom: `(SELECT ST_MULTI(ST_UNION(geom)) AS geom 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2021 and arr IN('56049','56213')) as t1`,
        geom_simple: `(SELECT ST_MULTI(ST_UNION(geom_simple)) AS geom_simple 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2021 and arr IN('56049','56213')) as t2`,
      },
      conditions: {
        year: 2022,
        arr: `'56213'`,
      },
    },
    {
      op: OperationEnum.Update,
      values: {
        year: 2022,
      },
      geometries: {
        geom: `(SELECT ST_MULTI(ST_UNION(geom)) AS geom 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2021 and arr IN('85307','85001')) as t1`,
        geom_simple: `(SELECT ST_MULTI(ST_UNION(geom_simple)) AS geom_simple 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2021 and arr IN('85307','85001')) as t2`,
      },
      conditions: {
        year: 2022,
        arr: `'85001'`,
      },
    },
  ];
}
