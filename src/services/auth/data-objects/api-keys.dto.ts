import { Expose } from 'class-transformer';
import { BaseDTO } from '../../../common/base-classes/base-dto';
import {
  ApiAccessKeysEntity,
  ApiKeyStatus,
} from '../entities/api-access-keys.entity';

export class ApiKeysDTO extends BaseDTO {
  @Expose()
  apiKey: string;
  @Expose()
  serverUrl: string;
  status: ApiKeyStatus;
}
