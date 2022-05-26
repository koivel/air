import { MongoDbService } from '@air/mongo-db';
import { KUser, KUserRegisterReq } from '@air/shared-api-spec';
import { Collection, InsertOneResult, ObjectId } from 'mongodb';
import { singleton } from 'tsyringe';
import * as bcrypt from 'bcrypt';

@singleton()
export class UserDao {
  constructor(private mongoDbService: MongoDbService) {}

  private collection(): Collection<KUser> {
    return this.mongoDbService.getCol<KUser>('users');
  }

  public async findOneById(id: string): Promise<KUser> {
    return await this.collection().findOne({ _id: id });
  }

  public async findOneByEmail(email: string): Promise<KUser> {
    return await this.collection().findOne({ email: email });
  }

  public async updatePassword(userId: string, password: string) {
    const hash = bcrypt.hashSync(password, 10);
    await this.collection().updateOne(
      { _id: userId },
      { $set: { passwordHash: hash } }
    );
  }

  public async register(body: KUserRegisterReq): Promise<string> {
    const hash = bcrypt.hashSync(body.password, 10);
    const user: KUser = {
      _id: new ObjectId().toString(),
      email: body.email,
      registrationTimeEpochMs: Date.now(),
      passwordHash: hash,
    };
    const result: InsertOneResult = await this.collection().insertOne(user);
    return result.insertedId.toString();
  }
}
