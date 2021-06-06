import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PayDayLoan } from './PaydayLaon.entity';
import { SMELOAN } from './SME.entity';

@Entity()
export class User {
  @ApiProperty({
    required: false,
    description: 'Autogenerated',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: String,
    nullable: false,
  })
  email: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    nullable: false,
    type: 'varchar',
  })
  firstname: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    nullable: false,
    type: 'varchar',
  })
  lastname: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    nullable: false,
    type: 'varchar',
  })
  phone: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    nullable: false,
    type: 'varchar',
  })
  password: string;

  @Column({
    nullable: false,
    default: false,
  })
  verified: boolean;

  @Column({
    default: new Date().toISOString(),
    nullable: false,
  })
  created_at: string;

  @OneToMany(() => PayDayLoan, (loan) => loan.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  paydayloans: PayDayLoan[];

  @OneToMany(() => SMELOAN, (loan) => loan.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  SMEloans: SMELOAN[];
}
