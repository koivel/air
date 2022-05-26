import _ from 'lodash';
import { SearchAggGenerator } from './search-agg-generator';

export class TopHitsAgg extends SearchAggGenerator {
  public async generate() {
    const includes: string[] = this.searchBody.options?.['includes'] || [
      'values',
      'tags',
    ];
    const size: number = parseInt(this.searchBody.options?.['size'] || '50');
    const sortKeys: string[] = this.searchBody.options?.['sortKeys'] || [
      '@timestamp',
    ];

    const sortEntries = sortKeys.map((k) => {
      const tmp = {};
      tmp[k] = { order: 'desc' };
      return tmp;
    });

    return {
      top_hits: {
        sort: sortEntries,
        _source: { includes: includes },
        size: size,
      },
    };
  }

  public mapResults(result: any, target: any) {
    const buckets = target['buckets'] || [];
    target['buckets'] = buckets;

    const hits = result.hits?.hits?.map((h) => h._source) || [];
    buckets.push(...hits);
  }
}
