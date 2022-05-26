import { Collection, Db, MongoClient } from 'mongodb';
import { singleton } from 'tsyringe';

@singleton()
export class MongoDbService {
  private _client: MongoClient;

  public async connect(certPath: string) {
    const client: MongoClient = new MongoClient(
      `mongodb+srv://${process.env['MONGO_USER']}:${process.env['MONGO_PASSWORD']}@${process.env['MONGO_HOST']}/admin?authSource=admin&ssl=true`,
      {
        sslValidate: true,
        sslCA: certPath,
      }
    );

    await client.connect();
    this._client = client;
  }

  public getClient(): MongoClient {
    return this._client;
  }

  public getCol<T>(collection: string): Collection<T> {
    const db: Db = this._client.db('koivel-prod');
    const col = db.collection<T>(collection);
    return col;
  }
}
