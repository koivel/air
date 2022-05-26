import _ from 'lodash';
import AggUtils from './agg-utils';
import { SearchAggGenerator } from './search-agg-generator';

export class GroupByTagsAgg extends SearchAggGenerator {
  public async generate() {
    const tags: string[] = this.searchBody.options?.['tags'];

    if (tags.length > 1) {
      return {
        multi_terms: {
          terms: tags.map((tag) => {
            return { field: `tags.${tag}` };
          }),
          size: 1000,
        },
      };
    } else {
      return {
        terms: {
          field: `tags.${tags[0]}`,
          size: 1000,
        },
      };
    }
  }

  public mapResults(result: any, target: any) {
    AggUtils.mapSubBuckets(this, result, target);
  }
}
