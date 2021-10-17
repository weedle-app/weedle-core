import { Column, Entity, OneToOne } from 'typeorm';
import { BaseAppEntity } from '../../../../_core/_base/base-app-entity';
import { UserEntity } from '../../user/entity/user.entity';

@Entity({ name: 'auth' })
export class AuthEntity extends BaseAppEntity {
  public tableName = 'auth';

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public email: string;

  @Column({
    type: 'varchar',
    select: false,
  })
  public password: string;

  @Column({
    type: 'boolean',
    nullable: true,
    default: false,
  })
  public social_auth: boolean;

  @Column({
    type: 'varchar',
    enum: ['facebook', 'google', 'apple', 'twitter'],
    nullable: true,
  })
  public social_auth_type: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public social_id: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  public account_verified: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public verification_expiration: Date;

  @Column({
    type: 'varchar',
    nullable: true,
    default: false,
  })
  public verification_code: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public password_reset: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public password_reset_code: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: true,
  })
  public reset_code_expiration: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  public changed_password: boolean;

  @OneToOne(() => UserEntity, (user) => user.auth)
  public user: UserEntity;
}
