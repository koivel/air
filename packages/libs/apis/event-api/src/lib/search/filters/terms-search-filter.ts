import { KEventSearchFilter } from '@air/shared-api-spec';
import esb from 'elastic-builder';
import { SearchContext } from '../search-context';
import { SearchFilterGenerator } from './search-filter-generator';

export class TermsSearchFilter extends SearchFilterGenerator {
  public async generate(
    context: SearchContext,
    searchFilter: KEventSearchFilter
  ): Promise<any[]> {
    const field: string = searchFilter.options['field'];
    const values: any[] = searchFilter.options['values'];

    if (values.length === 1) {
      return [esb.termQuery(field, values[0])];
    } else {
      return [esb.termsQuery(field, values)];
    }
  }
}
