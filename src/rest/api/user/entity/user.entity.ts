import { BaseAppEntity } from 'src/_core';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
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
  })
  public profile_type: string;

  @OneToOne(() => AuthEntity, (auth) => auth.user)
  @JoinColumn()
  public auth: AuthEntity;
}
