import { singleton } from 'tsyringe';
import { Client } from '@elastic/elasticsearch';

@singleton()
export class EsDbService {

  private client = new Client({
    node: `https://${process.env['ELASTIC_USER']}:${process.env['ELASTIC_PASSWORD']}@${process.env['ELASTIC_HOST']}`,
  });

  getClient(): Client {
    return this.client;
  }
}
