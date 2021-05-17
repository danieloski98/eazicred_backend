import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Notification')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  user_id: string;

  @Column({ nullable: true })
  admin: boolean;

  @Column({ nullable: false })
  message: string;

  @Column({
    nullable: false,
    default: new Date().toISOString(),
  })
  create_at: string;
}
