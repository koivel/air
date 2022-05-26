import { KEventSearchFilter } from '@air/shared-api-spec';
import { SearchContext } from '../search-context';

export abstract class SearchFilterGenerator {
  abstract generate(
    context: SearchContext,
    searchFilter: KEventSearchFilter
  ): Promise<any[]>;
}
