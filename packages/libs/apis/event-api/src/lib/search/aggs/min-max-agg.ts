import _ from 'lodash';
import { SearchAggGenerator } from './search-agg-generator';

export class MinMaxAgg extends SearchAggGenerator {
  public async generate() {
    const valueField = this.searchBody?.options?.['field'] || 'values.value';

    return {
      stats: {
        field: valueField,
      },
    };
  }

  public mapResults(result: any, target: any) {
    _.set(target, 'values.min', result.min);
    _.set(target, 'values.max', result.max);

    if (this.searchBody?.options?.['diff'] === true) {
      _.set(target, 'values.diff', result.max - result.min);
    }
  }
}
