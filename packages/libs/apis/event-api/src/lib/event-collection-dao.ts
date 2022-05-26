import { MongoDbService } from '@air/mongo-db';
import { KEventCollection } from '@air/shared-api-spec';
import { singleton } from 'tsyringe';

@singleton()
export class EventCollectionDao {
  constructor(private mongoDbService: MongoDbService) {}

  public async findOneById(id: string): Promise<KEventCollection> {
    const collection = await this.mongoDbService
      .getCol('event-collection')
      .findOne<KEventCollection>({ _id: id });
    return collection;
  }
}
