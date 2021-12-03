import { AbstractDataAggregation } from '../../../common/AbstractDataAggregation';
import { StaticAbstractDataset } from '@betagouvpdc/perimeters';
import { CreateGeoTable } from '@betagouvpdc/perimeters/dist/datastructure/000_CreateGeoTable';

export class TerritoriesCode2020 extends AbstractDataAggregation {
  static producer = 'obs';
  static dataset = 'code';
  static year = 2020;
  static table = 'territories_code';
  readonly sql = `
    INSERT INTO ${this.targetTableWithSchema} (
      year,
      l_arr,
      arr,
      l_com,
      com,
      l_epci,
      epci,
      l_aom,
      aom,
      l_dep,
      dep,
      l_reg,
      reg,
      l_country,
      country
    )
    SELECT year,
    l_arr,
    arr,
    l_com,
    com,
    l_epci,
    epci,
    l_aom,
    aom,
    l_dep,
    dep,
    l_reg,
    reg,
    l_country,
    country
    FROM ${this.targetSchema}.${CreateGeoTable.table}
    WHERE year = ${(this.constructor as StaticAbstractDataset).year}
    ON CONFLICT DO NOTHING;
  `;
}