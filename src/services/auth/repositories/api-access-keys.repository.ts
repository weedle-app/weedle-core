import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository } from 'typeorm';
import BaseRepository from '../../../common/base-classes/base-repository';
import { ApiAccessKeysEntity } from '../entities/api-access-keys.entity';
import { AuthEntity } from '../entities/auth.entity';

export interface IApiKeyAccessRepository {
  createApiKeys(
    apiKey: string,
    apiSecret: string,
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
    apiSecret: string,
    auth: AuthEntity,
  ): Promise<ApiAccessKeysEntity> {
    const apiKeyExists = await this.findOne({ apiKey, apiSecret });
    if (apiKeyExists) {
      throw new InternalServerErrorException();
    }
    const apiAccessKey = new ApiAccessKeysEntity();
    apiAccessKey.apiKey = apiKey;
    apiAccessKey.apiSecret = apiSecret;

    return this.save(apiAccessKey);
  }

  fetchApiKeyById(id: string): Promise<ApiAccessKeysEntity> {
    return this.findOne(id);
  }

  fetchByApiKey(apiKey: string): Promise<ApiAccessKeysEntity> {
    return this.findOne({ apiKey });
  }

  fetchApiKeysByUserAuthId(auth: AuthEntity): Promise<ApiAccessKeysEntity[]> {
    return this.find({ relations: ['auth'], where: { auth } });
  }
}
