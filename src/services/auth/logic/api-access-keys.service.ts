import { Injectable } from '@nestjs/common';
import ApiAccessKeysRepository from '../repositories/api-access-keys.repository';

@Injectable()
export class ApiAccessKeysService {
  constructor(
    private readonly apiAccessKeysRepository: ApiAccessKeysRepository,
  ) {}

  async getApiKeyById(id: string) {
    this.apiAccessKeysRepository.fetchApiKeyById(id);
  }

  async getApiKeysListByUserId(userId: string) {
    this.apiAccessKeysRepository.fetchApiKeysByUserAuthId(userId);
  }
}
