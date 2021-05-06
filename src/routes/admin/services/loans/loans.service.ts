import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PayDayLoan } from 'src/Schema/PaydayLaon.entity';
import { SMELOAN } from 'src/Schema/SME.entity';
import { Return } from 'src/utils/Returnfunctions';
import { IReturnObject } from 'src/utils/ReturnObject';
import { Repository } from 'typeorm';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(SMELOAN) private SMEloanRepo: Repository<SMELOAN>,
    @InjectRepository(PayDayLoan)
    private paydayloanRepo: Repository<PayDayLoan>,
  ) {}

  // get SME loans
  async getSMELoans(): Promise<IReturnObject> {
    try {
      const sme = await this.SMEloanRepo.find({ relations: ['user'] });
      return Return({
        error: false,
        statusCode: 200,
        data: sme,
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

  // get payday loans
  async getpaydayloansLoans(): Promise<IReturnObject> {
    try {
      const sme = await this.paydayloanRepo.find({ relations: ['user'] });
      return Return({
        error: false,
        statusCode: 200,
        data: sme,
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

  async getSMELoan(id: string): Promise<IReturnObject> {
    try {
      const sme = await this.SMEloanRepo.findOne({
        where: { id },
        relations: ['user'],
      });

      if (sme === undefined) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'SME loan not found!',
        });
      }
      return Return({
        error: false,
        statusCode: 200,
        data: sme,
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

  async getpaydayloansLoan(id: string): Promise<IReturnObject> {
    try {
      const sme = await this.paydayloanRepo.findOne({
        where: { id },
        relations: ['user'],
      });
      if (sme === undefined) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'Payday loan not found!',
        });
      }
      return Return({
        error: false,
        statusCode: 200,
        data: sme,
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
