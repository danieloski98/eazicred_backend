import { ApiProperty } from '@nestjs/swagger';
import { EMPLOYMENT_STATUS } from 'src/utils/enums/Employmentstatus';
import { LOANTYPE } from 'src/utils/enums/LoanType';
import { MARITAL_STATUS } from 'src/utils/enums/MaritalStatus';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity()
export class PayDayLoan {
  @ApiProperty({
    required: false,
    description: 'This is auto generated',
  })
  @PrimaryGeneratedColumn('increment')
  id: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  user_id: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  BVN: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'datetime',
    nullable: false,
  })
  DOB: Date;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  Means_of_ID: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  ID_number: string;

  @ApiProperty({
    required: true,
    nullable: false,
  })
  @Column({ type: 'datetime' })
  date_issued: Date;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'datetime',
    nullable: false,
  })
  expiry_date: Date;

  @ApiProperty({
    required: false,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  alt_number: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  home_address: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  landmark: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  LGA_of_residence: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  state: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'int',
    nullable: true,
  })
  length_of_time_at_current_address: number;

  @ApiProperty({
    required: true,
    enum: MARITAL_STATUS,
    enumName: 'MARITAL_STATUS',
  })
  @Column({
    type: 'enum',
    enum: MARITAL_STATUS,
    nullable: false,
  })
  marital_status: number;

  @ApiProperty({
    required: true,
    enum: EMPLOYMENT_STATUS,
    enumName: 'EMPLOYEMENT_STATUS',
  })
  @Column({
    type: 'enum',
    enum: EMPLOYMENT_STATUS,
    nullable: false,
  })
  employment_status: EMPLOYMENT_STATUS;

  @ApiProperty({
    required: false,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  current_employer: string;

  @ApiProperty({
    required: false,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  current_employer_address: string;

  @ApiProperty({
    required: false,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  current_employer_landmark: string;

  @ApiProperty({
    required: false,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  current_employer_LGA: string;

  @ApiProperty({
    required: false,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  current_employer_state: string;

  @ApiProperty({
    required: false,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  current_employer_office_number: string;

  @ApiProperty({
    required: false,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  staff_id: string;

  @ApiProperty({
    required: false,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  department: string;

  @ApiProperty({
    required: false,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  job_title: string;

  @ApiProperty({
    required: false,
  })
  @Column({
    type: 'datetime',
    nullable: true,
  })
  date_employed: Date;

  @ApiProperty({
    required: false,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  previous_employer: string;

  @ApiProperty({
    required: false,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  previous_employer_address: string;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @Column({
    nullable: true,
  })
  length_of_time_with_previous_employer: number;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'int',
    nullable: true,
  })
  jobs_in_past_5_years: number;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'datetime',
    nullable: false,
  })
  current_paydate: Date;

  @ApiProperty({
    required: true,
    description: 'if the user has existing loan',
  })
  @Column({
    nullable: false,
  })
  existing_loan: boolean;

  @ApiProperty({
    required: true,
    enumName: 'LOANTYPE',
    enum: LOANTYPE,
  })
  @Column({
    type: 'enum',
    enum: LOANTYPE,
    nullable: true,
  })
  existing_loan_type: number;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  next_of_kin_surname: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  next_of_kin_firstname: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  next_of_kin_relationship: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  next_of_kin_phone: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  next_of_kin_address: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'int',
    nullable: false,
  })
  loan_amount: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @Column({
    type: 'int',
    nullable: false,
  })
  loan_tenure: number;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: String,
    nullable: false,
  })
  account_number: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'varchar',
    nullable: false,
  })
  account_name: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'varchar',
    nullable: false,
  })
  bank_name: string;

  @ApiProperty({
    required: true,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  hear_about_us: string;

  @ApiProperty({
    required: true,
    description: 'this is a file',
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  passport: string;

  @ApiProperty({
    required: true,
    description: 'this is a file',
  })
  @Column({
    nullable: true,
  })
  government_ID: string;

  // @ApiProperty({
  //   required: true,
  // })
  // @Column({
  //   nullable: false,
  // })
  // bank_statement: string;

  @ApiProperty({
    required: true,
    description: 'this is a file',
  })
  @Column({
    nullable: true,
  })
  company_id: string;

  @ApiProperty({
    required: true,
    description: 'this is a file',
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  letter_of_employment: string;

  @ApiProperty({
    required: true,
    description: 'this is a file',
  })
  @Column({
    nullable: true,
  })
  HR_letter_of_confirmation: string;

  @ApiProperty({
    required: true,
    description: 'this is a file',
  })
  @Column({
    nullable: true,
  })
  utility_bill: string;

  @ApiProperty({
    required: true,
    description: '1 = payday loan, 2 = sme loan',
  })
  @Column({
    nullable: false,
  })
  type: number;

  @ApiProperty({
    required: true,
    description: '1 = pending, 2 = approved, 3 = rejected',
  })
  @Column({
    nullable: false,
    default: 1,
  })
  status: number;

  @ApiProperty({
    required: true,
    description: 'This autogenerated',
  })
  @Column({
    nullable: false,
    default: new Date().toISOString(),
  })
  created_at: string;

  @ApiProperty({
    required: true,
    description: 'if it should be saved as draft',
  })
  @Column({
    nullable: false,
  })
  draft: boolean;

  @ManyToOne(() => User, (user) => user.paydayloans, {
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn({ referencedColumnName: 'id', name: 'user_id' })
  user: User;
}
