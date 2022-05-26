import { KEventSearchAgg } from '@air/shared-api-spec';
import _ from 'lodash';
import { SearchContext } from '../search-context';

export interface SearchAggGenerator {
  replaceSelf?(): KEventSearchAgg;
}

export abstract class SearchAggGenerator {
  public context: SearchContext;
  public searchBody: KEventSearchAgg;

  public parent?: SearchAggGenerator;
  public children?: SearchAggGenerator[] = [];

  public queryPath?: string;
  public resultPath?: string;

  public transient: boolean = false;

  public abstract generate(): Promise<any>;
  public abstract mapResults(result: any, target: any): void;
}
