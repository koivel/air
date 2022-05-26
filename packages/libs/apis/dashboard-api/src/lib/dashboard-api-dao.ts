import { MongoDbService } from '@air/mongo-db';

import { Collection } from 'mongodb';
import { singleton } from 'tsyringe';

import { KDashboard } from '@air/shared-api-spec';

@singleton()
export class DashboardApiDao {
  constructor(private mongoDbService: MongoDbService) {}

  private collection(): Collection {
    return this.mongoDbService.getCol('dashboards');
  }

  public async findOneById(id: string, perms: string[]): Promise<KDashboard> {
    const dashboard: KDashboard = this.collection().findOne({
      _id: id,
      perms: { $in: perms },
    }) as any as KDashboard;
    return dashboard;
  }

  public async findAllReadableThin(perms: string[]): Promise<KDashboard[]> {
    const dashboards = await this.collection()
      .find({
        perms: { $in: perms },
      })
      .project({
        _id: 1,
        scope: 1,
        displayName: 1,
        description: 1,
        backgroundImage: 1,
        tags: 1,
      })
      .toArray();
    return dashboards as KDashboard[];
  }
}
