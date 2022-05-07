import { BeforeInsert, Column, Entity, OneToMany, OneToOne } from 'typeorm';
// import * as bcrypt from 'bcrypt';
import { BaseAppEntity } from '../../../common/base-classes/base-entity';
import { UsersEntity } from '../../users/entities/users.entity';
import { ApiAccessKeysEntity } from './api-access-keys.entity';

@Entity({ name: 'auth' })
export class AuthEntity extends BaseAppEntity {
  tableName = 'auth';

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public password: string;

  @Column({
    type: 'boolean',
    default: false,
    name: 'account_verified',
  })
  public accountVerified: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: true,
    name: 'verification_expiration',
  })
  public verificationExpiration: Date;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'verification_code',
  })
  public verificationCode: string;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'password_reset',
  })
  public passwordReset: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'password_reset_code',
  })
  public passwordResetCode: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: true,
    name: 'reset_code_expiration',
  })
  public resetCodeExpiration: Date;

  @Column({
    type: 'boolean',
    default: false,
    name: 'changed_password',
  })
  public changedPassword: boolean;

  @OneToOne(() => UsersEntity, (user) => user.auth)
  public user: UsersEntity;

  @OneToMany(() => ApiAccessKeysEntity, (apiAccessKey) => apiAccessKey.auth, {
    nullable: true,
  })
  apiAccessKey: ApiAccessKeysEntity[];
}
