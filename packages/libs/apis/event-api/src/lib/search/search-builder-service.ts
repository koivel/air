import {
  KEventSearch,
  KEventSearchAgg,
  KEventSearchFilter,
  KEventSearchFilterTypeEnum,
  KEventSearchControlMeta,
  KEventSearchMappingTypeEnum,
} from '@air/shared-api-spec';
import { singleton } from 'tsyringe';
import { container } from 'tsyringe';
import { GroupByTagsAgg } from './aggs/group-by-tags-agg';
import { MinMaxTimeseriesAgg } from './aggs/min-max-timeseries-agg';
import { SearchAggGenerator } from './aggs/search-agg-generator';
import { SearchContext } from './search-context';
import _, { map } from 'lodash';
import { SearchFilterGenerator } from './filters/search-filter-generator';
import { TermSearchFilter } from './filters/term-search-filter';
import { Logger } from '@air/shared-utils';
import { MinMaxAgg } from './aggs/min-max-agg';
import { TermsSearchFilter } from './filters/terms-search-filter';
import { RangeFilter } from './filters/range-filter';
import { TopMetricsAgg } from './aggs/top-metrics-agg';
import { TimeseriesAgg } from './aggs/timeseries-agg';
import { TimeseriesTopMetricsAgg } from './aggs/timeseries-top-metrics-agg';
import AggUtils from './aggs/agg-utils';
import { TopHitsAgg } from './aggs/top-hits-agg';
import { SumAgg } from './aggs/sum-agg ';

@singleton()
export class SearchBuilderService {
  constructor() {
    container.register('VbmAggs/MixMaxTimeseries', MinMaxTimeseriesAgg);
    container.register('VbmAggs/MinMax', MinMaxAgg);
    container.register('VbmAggs/GroupByTags', GroupByTagsAgg);
    container.register('VbmAggs/Last', TopMetricsAgg);
    container.register('VbmAggs/Sum', SumAgg);
    container.register('VbmAggs/TopHits', TopHitsAgg);
    container.register('VbmAggs/Timeseries', TimeseriesAgg);
    container.register('VbmAggs/TimeseriesLast', TimeseriesTopMetricsAgg);

    container.register('VbmFilters/Equals', TermSearchFilter);
    container.register('VbmFilters/In', TermsSearchFilter);
    container.register('VbmFilters/Range', RangeFilter);
  }

  public buildContext(search: KEventSearch): SearchContext {
    const searchContext: SearchContext = {
      search: search,
      aggGenerators: [],
      kResultList: [],
    };

    const exploreNodes: {
      parent?: SearchAggGenerator;
      queryPath: string;
      resultPath: string;
    }[] = Object.keys(search.aggs).map((k) => {
      return { queryPath: 'aggs.' + k, resultPath: k };
    });

    while (exploreNodes.length > 0) {
      const current: {
        parent?: SearchAggGenerator;
        queryPath: string;
        resultPath: string;
      } = exploreNodes.pop();
      const queryPath: string = current.queryPath;

      const agg: KEventSearchAgg = _.get(search, queryPath);
      const generator: SearchAggGenerator = container.resolve(
        'VbmAggs/' + agg.type.toString()
      );
      generator.context = searchContext;
      generator.searchBody = agg;

      if (generator.replaceSelf) {
        const replacedAgg: KEventSearchAgg = generator.replaceSelf();
        _.set(search, queryPath, replacedAgg);
        exploreNodes.push(current);
        continue;
      }

      generator.parent = current.parent;
      generator.queryPath = queryPath;
      generator.resultPath = current.resultPath;

      if (generator.parent) {
        generator.parent.children.push(generator);
      }
      searchContext.aggGenerators.push(generator);

      const childAggs = generator.searchBody.aggs || {};

      exploreNodes.push(
        ...Object.keys(childAggs).map((k) => {
          return {
            queryPath: queryPath + '.aggs.' + k,
            resultPath: k,
            parent: generator,
          };
        })
      );
    }

    return searchContext;
  }

  private async buildFilterSet(
    path: string,
    context: SearchContext,
    filters: KEventSearchFilter[]
  ) {
    const filterSetJson: any[] = [];
    if (filters) {
      for (const searchFilter of filters) {
        const filterGenerator: SearchFilterGenerator = container.resolve(
          'VbmFilters/' + searchFilter.type.toString()
        );
        const generatedFilters: any[] = await filterGenerator.generate(
          context,
          searchFilter
        );
        filterSetJson.push(...generatedFilters);
      }
    }

    if (filterSetJson.length > 0) {
      _.set(context.esQuery, path, filterSetJson);
    }
  }

  private applyControlMeta(context: SearchContext) {
    const controlMeta: KEventSearchControlMeta = context.search.controlMeta;
    if (controlMeta) {
      if (!context.search.must) {
        context.search.must = [];
      }

      if (controlMeta.accountIds?.length > 0) {
        context.search.must.push({
          type: KEventSearchFilterTypeEnum.In,
          options: { field: 'accountId', values: controlMeta.accountIds },
        });
      }

      if (controlMeta.startDateEpochMs || controlMeta.endDateEpochMs) {
        context.search.must.push({
          type: KEventSearchFilterTypeEnum.Range,
          options: {
            field: '@timestamp',
            start: controlMeta.startDateEpochMs,
            end: controlMeta.endDateEpochMs,
          },
        });
      }
    }
  }

  private applyMappings(context: SearchContext) {
    const runTimeMappings = {};
    for (const mappingGenerator of context.search.mappings || []) {
      if (mappingGenerator.type === KEventSearchMappingTypeEnum.Multiply) {
        const factorFields = mappingGenerator.options['factorFields'];

        const math = factorFields.map((f) => `doc['${f}'].value`).join(' * ');
        const mapping = {
          type: mappingGenerator.options?.['type'] || 'long',
          script: { source: `emit(${math})` },
        };

        runTimeMappings[mappingGenerator.field] = mapping;
      }
    }

    if (Object.keys(runTimeMappings).length > 0) {
      context.esQuery['runtime_mappings'] = runTimeMappings;
    }
  }

  public async buildSearch(context: SearchContext) {
    context.esQuery = {
      index: 'event_api_kevents-' + context.search.collectionId,
      size: 0,
    };

    this.applyControlMeta(context);

    await this.buildFilterSet('query.bool.must', context, context.search.must);
    await this.buildFilterSet(
      'query.bool.mustNot',
      context,
      context.search.mustNot
    );
    await this.buildFilterSet(
      'query.bool.should',
      context,
      context.search.should
    );

    for (const generator of context.aggGenerators) {
      const aggJson = await generator.generate();
      _.set(context.esQuery, generator.queryPath, aggJson);
    }

    this.applyMappings(context);

    Logger.info('built query : %j', context.esQuery);
  }

  public async mapResults(context: SearchContext) {
    context.kResultObject = { aggs: {} };
    for (const handler of context.aggGenerators) {
      if (!handler.parent) {
        const result = _.get(
          context.esResults,
          'aggregations.' + handler.resultPath
        );
        const target = {};
        await handler.mapResults(result, target);
        context.kResultObject.aggs[handler.resultPath] = target;
      }
    }
  }
}
