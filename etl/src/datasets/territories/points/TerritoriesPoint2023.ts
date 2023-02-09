import { AbstractDataAggregation } from '../../../common/AbstractDataAggregation';
import { StaticAbstractDataset } from '@betagouvpdc/evolution-geo';
import { CreateGeoTable } from '@betagouvpdc/evolution-geo/dist/datastructure/000_CreateGeoTable';

export class TerritoriesPoint2023 extends AbstractDataAggregation {
  static producer = 'obs';
  static dataset = 'point';
  static year = 2023;
  static table = 'territories_point';
  readonly sql = `
    INSERT INTO ${this.targetTableWithSchema} (
      year,
      type,
      territory,
      l_territory,
      geom
    )
    SELECT ${(this.constructor as StaticAbstractDataset).year},
    'com',
    arr,
    l_arr,
    centroid
    FROM ${this.targetSchema}.${CreateGeoTable.table}
    WHERE year = ${(this.constructor as StaticAbstractDataset).year}
    and com IS NOT NULL
    UNION
    SELECT ${(this.constructor as StaticAbstractDataset).year}, 
    'epci',
    epci,
    l_epci,
    ST_PointOnSurface(st_union(geom_simple))
    FROM ${this.targetSchema}.${CreateGeoTable.table}
    WHERE year = ${(this.constructor as StaticAbstractDataset).year}
    and epci IS NOT NULL
    GROUP BY epci,l_epci
    UNION
    SELECT ${(this.constructor as StaticAbstractDataset).year},
    'aom',
    aom,
    l_aom,
    ST_PointOnSurface(st_union(geom_simple))
    FROM ${this.targetSchema}.${CreateGeoTable.table}
    WHERE year = ${(this.constructor as StaticAbstractDataset).year}
    and aom IS NOT NULL
    GROUP BY aom,l_aom
    UNION
    SELECT ${(this.constructor as StaticAbstractDataset).year},
    'dep',
    dep,
    l_dep,
    ST_PointOnSurface(st_union(geom_simple))
    FROM ${this.targetSchema}.${CreateGeoTable.table}
    WHERE year = ${(this.constructor as StaticAbstractDataset).year}
    and dep IS NOT NULL
    GROUP BY dep,l_dep
    UNION
    SELECT ${(this.constructor as StaticAbstractDataset).year},
    'reg',
    reg,
    l_reg,
    ST_PointOnSurface(st_union(geom_simple))
    FROM ${this.targetSchema}.${CreateGeoTable.table}
    WHERE year = ${(this.constructor as StaticAbstractDataset).year}
    and reg IS NOT NULL
    GROUP BY reg,l_reg
    UNION
    SELECT distinct on (country) 
    ${(this.constructor as StaticAbstractDataset).year},
    'country',
    country,
    l_country,
    ST_PointOnSurface(st_union(geom_simple))
    FROM ${this.targetSchema}.${CreateGeoTable.table}
    WHERE year = ${(this.constructor as StaticAbstractDataset).year} 
    and country <> 'XXXXX'
    GROUP BY country,l_country
    UNION
    SELECT ${(this.constructor as StaticAbstractDataset).year},
    'country',
    country,
    l_country,
    centroid
    FROM ${this.targetSchema}.${CreateGeoTable.table}
    WHERE year = ${(this.constructor as StaticAbstractDataset).year} 
    and arr = '75056'
    ON CONFLICT DO NOTHING;
  `;
}
