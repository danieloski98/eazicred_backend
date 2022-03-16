import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserNotiService } from 'src/routes/notifications/services/user/user.service';
import { PayDayLoan } from 'src/Schema/PaydayLaon.entity';
import { SMELOAN } from 'src/Schema/SME.entity';
import { User } from 'src/Schema/User.entity';
import { Return } from 'src/utils/Returnfunctions';
import { IReturnObject } from 'src/utils/ReturnObject';
import { Repository } from 'typeorm';
import { EmailService } from '../email/email.service';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(SMELOAN) private SMEloanRepo: Repository<SMELOAN>,
    @InjectRepository(PayDayLoan)
    private paydayloanRepo: Repository<PayDayLoan>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private notiService: UserNotiService,
    private emailService: EmailService,
  ) {}

  // get SME loans
  async getSMELoans(): Promise<IReturnObject> {
    try {
      const sme = await this.SMEloanRepo.find();
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
      const sme = await this.paydayloanRepo.find({ relations: ['agent'] });
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

  async statuschangepaydayloansLoan(
    id: string,
    status: number,
  ): Promise<IReturnObject> {
    try {
      const sme = await this.paydayloanRepo.findOne({
        where: { id },
      });
      if (sme === undefined) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'Payday loan not found!',
        });
      }

      // check the status,
      if (status < 2 || status > 3) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'invalid status',
        });
      }

      // change the status
      const update = await this.paydayloanRepo
        .createQueryBuilder()
        .update()
        .set({ status })
        .where({ id })
        .execute();

      if (update.affected > 0) {
        switch (status) {
          case 2: {
            await this.notiService.sendUserNot(
              sme.user_id,
              `Your paydayloan with id ${sme.id} has been approved`,
            );
            // send email
            const email = await this.emailService.sendGrantEmail(
              sme.id,
              sme.email,
              'Payday Loan',
            );
            console.log(email);
            break;
          }
          case 3: {
            await this.notiService.sendUserNot(
              sme.user_id,
              `Your paydayloan with id ${sme.id} was rejected, Please contact support.`,
            );
            const email = await this.emailService.sendDeclinedEmail(
              sme.id,
              sme.email,
              'Payday Loan',
            );
            console.log(email);
            break;
          }
        }
      }

      const newloan = await this.paydayloanRepo.findOne({
        where: { id },
        relations: ['user'],
      });

      return Return({
        error: false,
        statusCode: 200,
        successMessage:
          status === 2 ? 'Loan approved' : 'loan rejected, contact support',
        data: newloan,
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

  async statuschangeSMEloansLoan(
    id: string,
    status: number,
  ): Promise<IReturnObject> {
    try {
      const sme = await this.SMEloanRepo.findOne({
        where: { id },
      });
      if (sme === undefined) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'SME loan not found!',
        });
      }

      // check the status,
      if (status < 2 || status > 3) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'invalid status',
        });
      }

      // change the status
      const update = await this.SMEloanRepo.createQueryBuilder()
        .update()
        .set({ status })
        .where({ id })
        .execute();
      if (update.affected > 0) {
        switch (status) {
          case 2: {
            await this.notiService.sendUserNot(
              sme.user_id,
              `Your SME with id ${sme.id} has been approved`,
            );
            break;
          }
          case 3: {
            await this.notiService.sendUserNot(
              sme.user_id,
              `Your SME with id ${sme.id} was rejected, Please contact support.`,
            );
            break;
          }
        }
      }

      console.log(typeof status);

      const newloan = await this.SMEloanRepo.findOne({
        where: { id },
      });

      return Return({
        error: false,
        statusCode: 200,
        successMessage:
          status === 2 ? 'Loan approved' : 'loan rejected, contact support',
        data: { id: status, newloan },
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

  async getAllUsers(): Promise<IReturnObject> {
    try {
      const users = await this.userRepo.find();
      return Return({
        error: false,
        statusCode: 200,
        data: users,
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

  async geuserbyemail(email: string): Promise<IReturnObject> {
    try {
      const user = await this.userRepo.findOne({ where: { email } });
      return Return({
        error: false,
        statusCode: 200,
        data: { user },
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
