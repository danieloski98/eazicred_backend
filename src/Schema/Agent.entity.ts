import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PayDayLoan } from './PaydayLaon.entity';
import { SMELOAN } from './SME.entity';

@Entity()
export class Agent {
  @ApiProperty({
    type: String,
    description: 'Autogenerated',
  })
  @PrimaryGeneratedColumn('increment')
  id: string;

  @ApiProperty({
    type: String,
  })
  @Column({ nullable: false })
  firstname: string;

  @ApiProperty({
    type: String,
  })
  @Column({ nullable: false })
  lastname: string;

  @ApiProperty({
    type: String,
  })
  @Column({ nullable: false })
  email: string;

  @ApiProperty({
    type: String,
  })
  @Column({ nullable: false })
  phone: string;

  @ApiProperty({
    type: String,
    description: 'Autogenerated',
  })
  @Column({
    nullable: true,
    type: 'varchar',
    default: new Date().toISOString(),
  })
  created_at: string;

  @OneToMany(() => PayDayLoan, (loan) => loan.agent, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  paydayloans: PayDayLoan[];

  @OneToMany(() => SMELOAN, (loan) => loan.agent, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  smeloans: SMELOAN[];
}
