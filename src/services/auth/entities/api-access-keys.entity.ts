import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseAppEntity } from '../../../common/base-classes/base-entity';
import { AuthEntity } from './auth.entity';

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
  public serverUrl: string;

  @Column({
    type: 'varchar',
    name: 'auth_id',
  })
  public authId: string;

  @ManyToOne(() => AuthEntity, (auth) => auth.apiAccessKey, {
    onDelete: 'CASCADE',
  })
  auth: AuthEntity;
}
