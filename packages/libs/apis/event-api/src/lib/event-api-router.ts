import {
  KEventAccountSearch,
  KEventAccountSearchResult,
  KEventCollection,
  KEventSearch,
  KEventWriteReq,
  KJwtBody,
} from '@air/shared-api-spec';
import { AuthUtil, JwtUtil, Logger, TtlCache } from '@air/shared-utils';
import { Router } from 'express';
import { singleton } from 'tsyringe';

import { EventApiDao } from './event-api-dao';
import { EventCollectionDao } from './event-collection-dao';
import { SearchContext } from './search/search-context';

@singleton()
export class EventApiRouter {
  public static readonly ENV_JWT_SECRET = 'EVENT_API_JWT_SECRET';

  constructor(
    private eventApiDao: EventApiDao,
    private eventCollectionDao: EventCollectionDao,
    private accountsCache: TtlCache<KEventAccountSearchResult[]>
  ) {}

  private async assertPermsAllow(
    req,
    userId: string,
    collectionId: string,
    allowedPerms: string[]
  ) {
    const decoded: KJwtBody = JwtUtil.extractFromReq(req);

    const eventCollection: KEventCollection =
      await this.eventCollectionDao.findOneById(collectionId);
    const perms: string[] = [
      ...(eventCollection?.defualtPerms || []),
      ...(decoded ? decoded.perms.map((p) => p.perm) : []),
    ];
    AuthUtil.assertPermsAllow(allowedPerms, perms, { $userId: userId });
  }

  public attachRoutes(router: Router): Router {
    router.post('/events/search', async (req, res) => {
      const search: KEventSearch = req.body;

      const reqUserId: string = JwtUtil.extractUserIdFromReq(req);
      const searchUserId: string = search?.controlMeta?.userId || reqUserId;
      const collectionId: string = search.collectionId;
      await this.assertPermsAllow(req, reqUserId, collectionId, [
        `event-collection:${collectionId}:read:userId:*`,
        `event-collection:${collectionId}:read:userId:${searchUserId}`,
        `event-collection:${collectionId}:read:accountId:*`,
      ]);

      const resultContext: SearchContext = await this.eventApiDao.searchEvents(
        search
      );

      const searchResults = {};
      searchResults[search.key] = resultContext.kResultObject;

      const result = {
        success: true,
        result: searchResults,
      };

      if (search.options?.['debug'] === true) {
        result['esResult'] = resultContext.esResults;
        result['esQuery'] = resultContext.esQuery;
      }

      res.send(result);
    });

    router.post('/events/search/accounts', async (req, res) => {
      const search: KEventAccountSearch = req.body;
      Logger.info('account search : %j', search);

      const reqUserId: string = JwtUtil.extractUserIdFromReq(req);
      const collectionId: string = search.collectionId;

      const searchUserId: string = search.userId || reqUserId;
      await this.assertPermsAllow(req, reqUserId, collectionId, [
        `event-collection:${collectionId}:read:userId:*`,
        `event-collection:${collectionId}:read:userId:${searchUserId}`,
        `event-collection:${collectionId}:read:accountId:*`,
      ]);

      const accounts: KEventAccountSearchResult[] =
        await this.accountsCache.computeIfAbsentAsync(
          `${collectionId}/${searchUserId}`,
          120,
          () => this.eventApiDao.searchAccounts(collectionId, searchUserId)
        );

      const result = {
        success: true,
        result: accounts,
      };

      res.send(result);
    });

    router.post('/events/write', async (req, res) => {
      const decoded: KJwtBody = JwtUtil.extractFromReq(req);

      const eventWriteReq: KEventWriteReq = req.body;

      let success = true;
      for (const series of eventWriteReq.eventSeries || []) {
        const userId: string = decoded.userId;
        const collectionId: string = series.collectionId;
        const accountId: string = series.accountId.toLowerCase();
        const accountDisplayName: string =
          series.accountDisplayName.toLowerCase();

        await this.assertPermsAllow(req, userId, collectionId, [
          `event-collection:${collectionId}:write:userId:*`,
          `event-collection:${collectionId}:write:userId:${userId}`,

          `event-collection:${collectionId}:write:userId:${userId}:accountId:*`,
          `event-collection:${collectionId}:write:userId:${userId}:accountId:${accountId}`,

          `event-collection:${collectionId}:write:userId:${userId}:accountDisplayName:*`,
          `event-collection:${collectionId}:write:userId:${userId}:accountDisplayName:${accountDisplayName}`,
        ]);

        const result = await this.eventApiDao.writeSeriesEvents(userId, series);
        Logger.info(
          'write events : %s : %s : %j',
          userId,
          series.events.length,
          result
        );

        if (!result.success) {
          success = false;
        }
      }

      res.send({ success: success });
    });

    return router;
  }
}
