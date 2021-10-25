import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseAppEntity } from '../../../../_core/_base/base-app-entity';
import { AuthEntity } from '../../auth/entity/auth.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseAppEntity {
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
