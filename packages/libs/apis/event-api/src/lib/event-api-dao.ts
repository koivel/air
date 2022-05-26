import { EsDbService } from '@air/es-db';
import {
  KEvent,
  KEventAccountSearchResult,
  KEventSearch,
  KEventSeries,
} from '@air/shared-api-spec';
import { Logger } from '@air/shared-utils';
import { singleton } from 'tsyringe';
import { SearchBuilderService } from './search/search-builder-service';
import { SearchContext } from './search/search-context';

@singleton()
export class EventApiDao {
  constructor(
    private esDbService: EsDbService,
    private searchBuilder: SearchBuilderService
  ) {}

  public async searchAccounts(
    collectionId: string,
    userId: string
  ): Promise<KEventAccountSearchResult[]> {
    const result = await this.esDbService.getClient().search({
      index: `event_api_kevents-${collectionId}`,
      size: 0,
      query: {
        match: { userId: userId },
      },
      aggs: {
        accounts: {
          multi_terms: {
            terms: [{ field: 'accountId' }, { field: 'accountDisplayName' }],
          },
        },
      },
    });

    return (
      result?.['aggregations']?.['accounts']?.['buckets']?.map((b) => {
        return { accountId: b['key'][0], displayName: b['key'][1] };
      }) || []
    );
  }

  public async searchEvents(search: KEventSearch): Promise<SearchContext> {
    const startEpochMs = new Date().getTime();
    const context: SearchContext = this.searchBuilder.buildContext(search);
    await this.searchBuilder.buildSearch(context);
    const buildEpochMs = new Date().getTime();

    const esClient = this.esDbService.getClient();
    const esResults = await esClient.search(context.esQuery);
    context.esResults = esResults;
    const esSearchEpochMs = new Date().getTime();

    await this.searchBuilder.mapResults(context);
    const mapResultsEpochMs = new Date().getTime();

    Logger.info('build: %s', buildEpochMs - startEpochMs);
    Logger.info('search: %s', esSearchEpochMs - buildEpochMs);
    Logger.info('map: %s', mapResultsEpochMs - esSearchEpochMs);

    return context;
  }

  public async writeSeriesEvents(
    userId: string,
    series: KEventSeries
  ): Promise<{ success: boolean }> {
    const collectionId: string = series.collectionId;
    const accountId: string = series.accountId.toLowerCase();
    const accountDisplayName: string = series.accountDisplayName.toLowerCase();

    const bulk = [];
    for (const event of series.events) {
      const index: string = ['event_api_kevents', collectionId].join('-');
      const groupId: string = event.groupId;
      const eventBody = {
        '@timestamp': event.recordedAtEpochMs || Date.now(),
        userId: userId,
        collectionId: collectionId,
        accountId: accountId,
        accountDisplayName: accountDisplayName || accountId,
        groupId: groupId,
        tags: event.tags,
        values: event.values,
      };

      bulk.push({ create: { _index: index, id: null } });
      bulk.push(eventBody);
    }

    const writeResult = await this.esDbService
      .getClient()
      .bulk({ operations: bulk });
    return { success: !writeResult.errors };
  }
}
