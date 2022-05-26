import _ from 'lodash';
import { SearchAggGenerator } from './search-agg-generator';

export class TopMetricsAgg extends SearchAggGenerator {
  public async generate() {
    const values: string[] = this.searchBody.options?.['values'] || ['value'];

    return {
      top_metrics: {
        metrics: values.map((v) => {
          return { field: `values.${v}` };
        }),
        sort: [
          {
            '@timestamp': {
              order: 'desc',
            },
          },
        ],
        size: 1,
      },
    };
  }

  public mapResults(result: any, target: any) {
    for (const entry of Object.entries(result['top'][0].metrics)) {
      _.set(target, entry[0], entry[1]);
    }
  }
}
