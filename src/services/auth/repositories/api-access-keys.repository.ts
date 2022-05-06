import { EntityRepository } from 'typeorm';
import BaseRepository from '../../../common/base-classes/base-repository';
import { ApiAccessKeysEntity } from '../entities/api-access-keys.entity';
import { AuthEntity } from '../entities/auth.entity';

export interface IApiKeyAccessRepository {
  createApiKeys(
    apiKey: string,
    serverUrl: string,
    auth: AuthEntity,
  ): Promise<ApiAccessKeysEntity>;
  fetchApiKeyById(id: string): Promise<ApiAccessKeysEntity>;
}

@EntityRepository(ApiAccessKeysEntity)
export default class ApiAccessKeysRepository
  extends BaseRepository<ApiAccessKeysEntity>
  implements IApiKeyAccessRepository
{
  async createApiKeys(
    apiKey: string,
    serverUrl: string,
    auth: AuthEntity,
  ): Promise<ApiAccessKeysEntity> {
    const apiKeyExists = await this.findOne({ apiKey, serverUrl });
    if (apiKeyExists) {
      // regenerate key
    }
    const apiAccessKey = new ApiAccessKeysEntity();
    apiAccessKey.apiKey = apiKey;
    apiAccessKey.serverUrl = serverUrl;
    apiAccessKey.authId = auth.id;

    return this.save(apiAccessKey);
  }

  fetchApiKeyById(id: string): Promise<ApiAccessKeysEntity> {
    return this.findOne(id);
  }

  fetchApiKeysByUserAuthId(authId: string): Promise<ApiAccessKeysEntity[]> {
    return this.find({ authId });
  }
}
