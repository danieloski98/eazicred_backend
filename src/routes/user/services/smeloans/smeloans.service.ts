import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/routes/admin/services/email/email.service';
import { UserNotiService } from 'src/routes/notifications/services/user/user.service';
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
    private notiService: UserNotiService,
    private emailService: EmailService,
  ) {}

  async createSMEloan(
    id?: string,
    payload?: Partial<SMELOAN>,
  ): Promise<IReturnObject> {
    try {
      payload['user_id'] = payload.agent_id ? payload.agent_id : id;
      console.log(payload);
      // console.log(payload['user_id']);
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

      // if (payload['user_id']) {
      //   // send notification
      //   const usernoti = await this.notiService.sendUserNot(
      //     payload['user_id'],
      //     'Your SME loan was created successfully. you will be contacted shortly',
      //   );
      //   // get user
      //   const user = await this.userRepo.findOne({ id: payload['user_id'] });
      //   const adminNoti = await this.notiService.sendadminNot(
      //     `SME loan was created by user with email ${user.email}`,
      //   );
      //   // send email
      //   const email = await this.emailService.sendSuccessEmail(
      //     user.email,
      //     'SME Loan',
      //   );
      //   // const emailAdmin = await this.emailService.se
      //   const email2 = await this.emailService.sendAdminSuccessEmail(
      //     user.email,
      //     loan.id,
      //     'SME Loan',
      //   );
      // }

      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'SME loan request successful',
        data: loan,
      });
    } catch (error) {
      console.log(error);
      return Return({
        error: true,
        statusCode: 500,
        errorMessage: 'Internal Server Error',
        trace: error,
      });
    }
  }

  async updateSMELoan(
    id: string,
    payload: Partial<SMELOAN>,
  ): Promise<IReturnObject> {
    try {
      const item = await this.smeloanRepo.findOne({ where: { id } });
      if (item === undefined) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'SME loan not found',
        });
      }
      const updatedItem = await this.smeloanRepo
        .createQueryBuilder()
        .update()
        .set({ ...payload })
        .where({ id: id })
        .execute();
      if (updatedItem.affected > 0) {
        const usernoti = await this.notiService.sendUserNot(
          item['user_id'],
          `Your update the the SME loan with id ${item.id} was successful`,
        );
      }
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'Update SME loan',
        data: updatedItem,
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

  async deleteLoan(id: string): Promise<IReturnObject> {
    try {
      const item = await this.smeloanRepo.findOne({ where: { id } });
      if (item === undefined) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'SME loan not found',
        });
      }

      const updatedItem = await this.smeloanRepo.delete({ id });
      if (updatedItem.affected > 0) {
        const usernoti = await this.notiService.sendUserNot(
          item['user_id'],
          `You have successfully deleted the SME loan with id ${item.id} was successful`,
        );
      }
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'Update SME loan',
        data: updatedItem,
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

  async getSmeLoans(user_id: string): Promise<IReturnObject> {
    try {
      const loans = await this.smeloanRepo.find({
        where: { user_id, draft: false },
      });
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'SME loans',
        data: loans,
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

  async getSingleSmeLoans(id: string): Promise<IReturnObject> {
    try {
      const loan = await this.smeloanRepo.findOne({
        where: { id, draft: false },
      });
      if (loan === undefined || loan === null) {
        return Return({
          error: true,
          statusCode: 400,
          successMessage: 'SME loan not found',
        });
      }

      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'SME loans',
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

  async getdraftsSmeLoan(user_id: number): Promise<IReturnObject> {
    try {
      const dratfs = await this.smeloanRepo.find({
        where: { user_id },
      });

      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'drafts',
        data: dratfs,
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

  async getsingleDraft(loan_id: number): Promise<IReturnObject> {
    try {
      const draft = await this.smeloanRepo.findOne({
        where: { id: loan_id, draft: true },
      });

      if (draft === undefined) {
        return Return({
          error: true,
          statusCode: 400,
          successMessage: 'SME draft not found',
        });
      }

      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'SME dratf found',
        data: draft,
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
