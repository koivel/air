import { KEventSearchAgg, KEventSearchAggTypeEnum } from '@air/shared-api-spec';
import { Logger } from '@air/shared-utils';
import _ from 'lodash';
import { SearchAggGenerator } from './search-agg-generator';

export class TimeseriesTopMetricsAgg extends SearchAggGenerator {
  public override replaceSelf(): KEventSearchAgg {
    const replacedAgg: KEventSearchAgg = {
      type: KEventSearchAggTypeEnum.Timeseries,
      aggs: {
        tagGroups: {
          type: KEventSearchAggTypeEnum.GroupByTags,
          options: {
            tags: ['containerId'],
          },
          aggs: {
            last: {
              type: KEventSearchAggTypeEnum.Last,
            },
          },
        },
      },
    };

    _.set(replacedAgg, 'aggs.tagGroups.postProcess', this.postProcess);

    return replacedAgg;
  }

  public async generate() {}

  public mapResults(result: any, target: any) {}

  public postProcess(generator: SearchAggGenerator, result: any) {
    const buckets = result['buckets'];
    if (buckets.length > 0) {
      let sum = 0;
      for (const bucket of buckets) {
        const value = _.get(bucket, 'aggs.last.values.value');
        sum += value;
      }
      _.set(result, 'values.sum', sum);
    }
  }
}
