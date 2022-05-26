import { KEventSearchFilter } from '@air/shared-api-spec';
import esb from 'elastic-builder';
import { SearchContext } from '../search-context';
import { SearchFilterGenerator } from './search-filter-generator';

export class RangeFilter extends SearchFilterGenerator {
  public async generate(
    context: SearchContext,
    searchFilter: KEventSearchFilter
  ): Promise<any[]> {
    const field: string = searchFilter.options['field'];
    const start: number = searchFilter.options['start'];
    const end: number = searchFilter.options['end'];

    const query = esb.rangeQuery(field);
    if (start) {
      query.gte(start);
    }
    if (end) {
      query.lte(end);
    }

    return [query];
  }
}
