import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class PreLaunchLeads extends BaseEntity {
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
