import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseAppEntity } from '../../../common/base-classes/base-entity';
import { AuthEntity } from './auth.entity';

export enum ApiKeyStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

@Entity({ name: 'api_access_keys' })
export class ApiAccessKeysEntity extends BaseAppEntity {
  tableName = 'api_access_keys';

  @Column({
    type: 'varchar',
    name: 'api_key',
  })
  public apiKey: string;

  @Column({
    type: 'varchar',
    name: 'server_url',
  })
  public apiSecret: string;

  @Column({
    type: 'enum',
    enum: ApiKeyStatus,
    default: ApiKeyStatus.ACTIVE,
  })
  public status: ApiKeyStatus;

  @ManyToOne(() => AuthEntity, (auth) => auth.apiAccessKey, {
    onDelete: 'CASCADE',
  })
  auth: AuthEntity;
}
