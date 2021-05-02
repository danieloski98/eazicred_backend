import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SMELOAN } from 'src/Schema/SME.entity';
import { User } from 'src/Schema/User.entity';
import { Return } from 'src/utils/Returnfunctions';
import { IReturnObject } from 'src/utils/ReturnObject';
import { SMEvalidationObject } from 'src/utils/SMEloanValidator';
import { Repository } from 'typeorm';

@Injectable()
export class SmeloansService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(SMELOAN) private smeloanRepo: Repository<SMELOAN>,
  ) {}

  async createSMEloan(
    id: string,
    payload: Partial<SMELOAN>,
  ): Promise<IReturnObject> {
    try {
      payload['user_id'] = id;
      console.log(payload['user_id']);
      const validation = SMEvalidationObject.validate(payload);
      if (validation.error) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: validation.error.message,
          trace: validation.error,
        });
      }
      // CREATE THE LOAN
      const loan = await this.smeloanRepo.save(payload);
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'SME loan request successful',
        data: loan,
      });
    } catch (error) {
      return Return({
        error: true,
        statusCode: 500,
        errorMessage: 'Internal Server Error',
        trace: error,
      });
    }
  }
}
