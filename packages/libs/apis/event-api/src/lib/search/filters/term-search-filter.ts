import { KEventSearchFilter } from '@air/shared-api-spec';
import esb from 'elastic-builder';
import { SearchContext } from '../search-context';
import { SearchFilterGenerator } from './search-filter-generator';

export class TermSearchFilter extends SearchFilterGenerator {
  public async generate(
    context: SearchContext,
    searchFilter: KEventSearchFilter
  ): Promise<any[]> {
    return [
      esb.termQuery(
        searchFilter.options['field'],
        searchFilter.options['value']
      ),
    ];
  }
}
