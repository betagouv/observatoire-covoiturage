import { UpdateDataset, TransformationInterface, OperationEnum } from './common/UpdateDataset';
import { StaticAbstractDataset } from '@betagouvpdc/evolution-geo/dist/interfaces';

export class Perim2023 extends UpdateDataset {
  static producer = 'rpc';
  static dataset = 'perim';
  static year = 2023;
  static table = 'rpc_perim_2023';

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
    WHERE year = 2022 
    AND arr NOT IN('01039','02077','09255','16140','50015','51063','51637','71492','85037','85053')
  `;
  readonly transformations: Array<TransformationInterface> = [
    {
      op: OperationEnum.Update,
      values: {
        year: 2023,
        l_arr: `'Culoz-Béon'`,
      },
      geometries: {
        geom: `(SELECT ST_MULTI(ST_UNION(geom)) AS geom 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2022 and arr IN('01039','01138')) as t1`,
        geom_simple: `(SELECT ST_MULTI(ST_UNION(geom_simple)) AS geom_simple 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2022 and arr IN('01039','01138')) as t2`,
      },
      conditions: {
        year: 2023,
        arr: `'01138'`,
      },
    },
    {
      op: OperationEnum.Update,
      values: {
        year: 2023,
        l_arr: `'Bernoy-le-Château'`,
      },
      geometries: {
        geom: `(SELECT ST_MULTI(ST_UNION(geom)) AS geom 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2022 and arr IN('02077','02564')) as t1`,
        geom_simple: `(SELECT ST_MULTI(ST_UNION(geom_simple)) AS geom_simple 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2022 and arr IN('02077','02564')) as t2`,
      },
      conditions: {
        year: 2023,
        arr: `'02564'`,
      },
    },
    {
      op: OperationEnum.Update,
      values: {
        year: 2023,
      },
      geometries: {
        geom: `(SELECT ST_MULTI(ST_UNION(geom)) AS geom 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2022 and arr IN('09056','09255')) as t1`,
        geom_simple: `(SELECT ST_MULTI(ST_UNION(geom_simple)) AS geom_simple 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2022 and arr IN('09056','09255')) as t2`,
      },
      conditions: {
        year: 2023,
        arr: `'09056'`,
      },
    },
    {
      op: OperationEnum.Update,
      values: {
        year: 2023,
        l_arr: `'Mansle-les-Fontaines'`,
      },
      geometries: {
        geom: `(SELECT ST_MULTI(ST_UNION(geom)) AS geom 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2022 and arr IN('16140','16206')) as t1`,
        geom_simple: `(SELECT ST_MULTI(ST_UNION(geom_simple)) AS geom_simple 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2022 and arr IN('16140','16206')) as t2`,
      },
      conditions: {
        year: 2023,
        arr: `'16206'`,
      },
    },
    {
      op: OperationEnum.Update,
      values: {
        year: 2023,
        l_arr: `'Tourneville-sur-Mer'`,
      },
      geometries: {
        geom: `(SELECT ST_MULTI(ST_UNION(geom)) AS geom 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2022 and arr IN('50015','50272')) as t1`,
        geom_simple: `(SELECT ST_MULTI(ST_UNION(geom_simple)) AS geom_simple 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2022 and arr IN('50015','50272')) as t2`,
      },
      conditions: {
        year: 2023,
        arr: `'50272'`,
      },
    },
    {
      op: OperationEnum.Update,
      values: {
        year: 2023,
        l_arr: `'Coeur-de-la-Vallée'`,
      },
      geometries: {
        geom: `(SELECT ST_MULTI(ST_UNION(geom)) AS geom 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2022 and arr IN('51063','51457','51637')) as t1`,
        geom_simple: `(SELECT ST_MULTI(ST_UNION(geom_simple)) AS geom_simple 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2022 and arr IN('51063','51457','51637')) as t2`,
      },
      conditions: {
        year: 2023,
        arr: `'51457'`,
      },
    },
    {
      op: OperationEnum.Update,
      values: {
        year: 2023,
        l_arr: `'Bonnay-Saint-Ythaire'`,
      },
      geometries: {
        geom: `(SELECT ST_MULTI(ST_UNION(geom)) AS geom 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2022 and arr IN('71042','71492')) as t1`,
        geom_simple: `(SELECT ST_MULTI(ST_UNION(geom_simple)) AS geom_simple 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2022 and arr IN('71042','71492')) as t2`,
      },
      conditions: {
        year: 2023,
        arr: `'71042'`,
      },
    },
    {
      op: OperationEnum.Update,
      values: {
        year: 2023,
        l_arr: `'Terval'`,
      },
      geometries: {
        geom: `(SELECT ST_MULTI(ST_UNION(geom)) AS geom 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2022 and arr IN('85037','85053','85289')) as t1`,
        geom_simple: `(SELECT ST_MULTI(ST_UNION(geom_simple)) AS geom_simple 
        FROM ${this.targetTableWithSchema} 
        WHERE year = 2022 and arr IN('85037','85053','85289')) as t2`,
      },
      conditions: {
        year: 2023,
        arr: `'85289'`,
      },
    },
  ];
}
