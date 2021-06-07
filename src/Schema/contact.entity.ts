import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ContactFormDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
    type: 'text',
  })
  message: string;
}
