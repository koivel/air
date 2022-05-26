import _ from 'lodash';
import { SearchAggGenerator } from './search-agg-generator';

export class SumAgg extends SearchAggGenerator {
  public async generate() {
    const valueField = this.searchBody?.options?.['field'] || 'values.value';

    return {
      sum: {
        field: valueField,
      },
    };
  }

  public mapResults(result: any, target: any) {
    _.set(target, 'values.sum', result.value);
  }
}
