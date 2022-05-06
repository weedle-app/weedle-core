import { Column, Entity, OneToOne } from 'typeorm';
import { BaseAppEntity } from '../../../common/base-classes/base-entity';
import { UsersEntity } from '../../users/entities/users.entity';

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
  })
  public password: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  public account_verified: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: true,
  })
  public verification_expiration: Date;

  @Column({
    type: 'varchar',
    nullable: true,
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

  @OneToOne(() => UsersEntity, (user) => user.auth)
  public user: UsersEntity;
}
