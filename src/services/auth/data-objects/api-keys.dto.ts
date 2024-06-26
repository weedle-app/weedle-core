import { Exclude, Expose } from 'class-transformer';
import { BaseDTO } from '../../../common/base-classes/base-dto';
import { ApiKeyStatus } from '../entities/api-access-keys.entity';

export class ApiKeysDTO extends BaseDTO {
  @Expose()
  apiKey: string;
  @Exclude()
  apiSecret: string;
  status: ApiKeyStatus;
}
