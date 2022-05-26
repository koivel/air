import { KEventSearch, KEventSearchResultListEntry } from "@air/shared-api-spec";
import { SearchAggGenerator } from "./aggs/search-agg-generator";

export interface SearchContext { 
    search: KEventSearch;
    esQuery?: any;
    esResults?: any;
    aggGenerators?: SearchAggGenerator[];
    kResultList?: KEventSearchResultListEntry[];
    kResultObject?: any;
}