import { Injectable } from '@nestjs/common';
import { ApiKeysDTO } from '../data-objects/api-keys.dto';
import ApiAccessKeysRepository from '../repositories/api-access-keys.repository';

@Injectable()
export class ApiAccessKeysService {
  constructor(
    private readonly apiAccessKeysRepository: ApiAccessKeysRepository,
  ) {}

  async getApiKeyById(id: string): Promise<ApiKeysDTO> {
    const apiDetails = await this.apiAccessKeysRepository.fetchApiKeyById(id);

    return this.apiAccessKeysRepository.transformEntity<ApiKeysDTO>(
      apiDetails,
      ApiKeysDTO,
    );
  }

  async getApiCredentialsByApiKey(apiKey: string): Promise<ApiKeysDTO | null> {
    return this.apiAccessKeysRepository.fetchByApiKey(apiKey);
  }
}
