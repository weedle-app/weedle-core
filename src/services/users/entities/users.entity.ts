import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseAppEntity } from '../../../common/base-classes/base-entity';
import { AuthEntity } from '../../auth/entities/auth.entity';

@Entity({ name: 'users' })
export class UsersEntity extends BaseAppEntity {
  public tableName = 'users';

  @Column({
    type: 'varchar',
    unique: true,
  })
  public email: string;

  @Column({
    type: 'varchar',
    enum: ['customer', 'admin'],
    default: 'customer',
  })
  public profile_type: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  public auth_id: string;

  @OneToOne(() => AuthEntity, (auth) => auth.user)
  @JoinColumn({ name: 'auth_id' })
  public auth: AuthEntity;
}
