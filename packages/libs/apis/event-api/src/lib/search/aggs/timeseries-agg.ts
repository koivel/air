import _ from 'lodash';
import AggUtils from './agg-utils';
import { SearchAggGenerator } from './search-agg-generator';

export class TimeseriesAgg extends SearchAggGenerator {
  public async generate() {
    const query = {
      date_histogram: {
        field: '@timestamp',
        min_doc_count: 1,
      },
    };

    const fixedInterval: string = this.searchBody.options?.['fixedInterval'];
    const calInterval: string = this.searchBody.options?.['calInterval'];
    if (fixedInterval) {
      _.set(query, 'date_histogram.fixed_interval', fixedInterval);
    } else if (calInterval) {
      _.set(query, 'date_histogram.calendar_interval', calInterval);
    } else {
      _.set(query, 'date_histogram.calendar_interval', 'hour');
    }

    return query;
  }

  public mapResults(result: any, target: any) {
    AggUtils.mapSubBuckets(this, result, target);
  }
}
