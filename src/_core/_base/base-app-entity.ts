import {
  BaseEntity,
  Column,
  CreateDateColumn,
  getRepository,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseAppEntity extends BaseEntity {
  abstract tableName?: string;

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  public active: boolean;

  @Column({
    type: 'boolean',
    select: false,
    default: false,
  })
  public deleted: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  public repository(tableName?: string): Repository<BaseAppEntity> {
    return getRepository(tableName || this.tableName.toLowerCase());
  }
}
