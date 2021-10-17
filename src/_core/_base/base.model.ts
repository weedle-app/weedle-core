import {
  BaseEntity,
  Column,
  CreateDateColumn,
  getRepository,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel extends BaseEntity {
  abstract tableName: string;

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    type: 'boolean',
    select: false,
    default: false,
  })
  public deleted: false;

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

  public config() {
    return {
      softDelete: true,
      uniques: [],
      returnDuplicates: false,
      fillables: [],
      updateFillables: [],
      hiddenFields: ['deleted'],
    };
  }

  public repository(tableName?: string): Repository<BaseModel> {
    return getRepository(tableName || this.tableName.toLowerCase());
  }
}
