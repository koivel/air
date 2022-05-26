import { Logger } from '@air/shared-utils';
import _ from 'lodash';
import { SearchContext } from '../search-context';
import { SearchAggGenerator } from './search-agg-generator';

export class MinMaxTimeseriesAgg extends SearchAggGenerator {
  public async generate() {
    const valueField = this.searchBody.options?.['field'] || 'values.value';

    const query: any = {
      date_histogram: {
        field: '@timestamp',
        min_doc_count: 1,
      },
      aggs: {
        minValue: {
          min: {
            field: valueField,
          },
        },
        maxValue: {
          max: {
            field: valueField,
          },
        },
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
    let series = result['buckets']
      .map((b) => {
        return {
          key: b['key'],
          values: {
            minValue: b['minValue']['value'],
            maxValue: b['maxValue']['value'],
          },
        };
      })
      .filter((s) => s.minValue !== null || s.maxValue !== null);

    if (this.searchBody.options['serialDiff']) {
      let previousMax;
      for (const p of series) {
        if (!previousMax) {
          previousMax = p['values']['minValue'];
        }

        const serialDiff: number =
          p['values']['minValue'] - previousMax + (p['values']['maxValue'] - p['values']['minValue']);

        p['values']['serialDiff'] = serialDiff;
        previousMax = p['values']['maxValue'];
      }

      series = series.filter((s) => s['values']['serialDiff'] > 0);
    }

    if (series.length > 0) {
      _.set(target, 'buckets', series);
    }
  }
}
