import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModelEntity } from '../../../../base-classes/base-entity';

@Entity()
export class PreLaunchLeads extends BaseModelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fullName: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({ nullable: true })
  extraData: string;
}
