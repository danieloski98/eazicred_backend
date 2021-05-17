import { UserNotiService } from './../../../notifications/services/user/user.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PayDayLoan } from 'src/Schema/PaydayLaon.entity';
import { User } from 'src/Schema/User.entity';
import { IFile } from 'src/Types/file';
import { PaydayloanValidator } from 'src/utils/PaydayloanValidator';
import { Return } from 'src/utils/Returnfunctions';
import { IReturnObject } from 'src/utils/ReturnObject';
import { Repository } from 'typeorm';
import { extname, join } from 'path';
import { copyFileSync, rmdirSync, existsSync, mkdirSync } from 'fs';
import { FILE_URL } from 'src/utils/filesurl';

export interface Files {
  government_ID: IFile[];
  passport: IFile[];
  company_id: IFile[];
  letter_of_employment: IFile[];
  HR_letter: IFile[];
  utility_bill: IFile[];
}

@Injectable()
export class PaydayloansService {
  logger = new Logger();
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(PayDayLoan)
    private paydayloanRepo: Repository<PayDayLoan>,
    private notiService: UserNotiService,
  ) {}

  async createPaydayloan(id: string, loan: PayDayLoan): Promise<IReturnObject> {
    try {
      loan['user_id'] = id;
      console.log(loan['user_id']);
      const validation = PaydayloanValidator.validate(loan);
      if (validation.error) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: validation.error.message,
          trace: validation.error,
        });
      }

      // CREATE THE LOAN
      const newloan = await this.paydayloanRepo.save(loan);
      // upload files
      // await this.handleFiles(newloan.id, files);

      const user = await this.userRepo.findOne({
        where: { id: newloan.user_id },
      });

      if (newloan.draft) {
        await this.notiService.sendUserNot(
          newloan.user_id,
          `Your payday laon was created successfully. you will be contacted shortly`,
        );
        await this.notiService.sendadminNot(
          `User with email ${user.email} just created a payday loan`,
        );
      } else {
        await this.notiService.sendUserNot(
          newloan.user_id,
          `The payday loan has been saved as draft, you can continue edit later`,
        );
      }

      return Return({
        error: false,
        statusCode: 200,
        successMessage: loan.draft
          ? 'Loan saved as draft'
          : 'Payday loan request successful',
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

  async uploadFiles(id: number, files: Files): Promise<IReturnObject> {
    try {
      const loan = await this.paydayloanRepo.findOne({ where: { id } });
      if (loan === undefined) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'Loan entry not found',
        });
      }

      await this.handleFiles(id as any, files);
      const updatedloan = await this.paydayloanRepo.findOne({ where: { id } });
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'Payday loan request successful',
        data: updatedloan,
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

  // get all payday loans by a particular user

  async getpaydayloans(user_id: string): Promise<IReturnObject> {
    try {
      // get the loans that are not drafts
      const loans = await this.paydayloanRepo.find({
        where: { user_id, draft: false },
      });
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'paydayloans',
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

  async getsinglepaydayloans(id: string): Promise<IReturnObject> {
    try {
      // get the loans that are not drafts
      const loan = await this.paydayloanRepo.findOne({
        where: { id, draft: false },
      });
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'paydayloan',
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

  // edit a paydayloan
  async updatePaydayloan(
    id: string,
    payload: Partial<PayDayLoan>,
    files?: Files,
  ): Promise<IReturnObject> {
    try {
      const exist = await this.paydayloanRepo.findOne({ where: { id } });
      if (exist === undefined) {
        return Return({
          error: false,
          errorMessage: 'Not found',
          statusCode: 400,
        });
      }

      // update details
      const updateDetails = await this.paydayloanRepo
        .createQueryBuilder()
        .update()
        .set({ ...payload })
        .where({ id })
        .execute();

      // check if there are files
      if (files) {
        // upload files
        await this.handleFiles(id, files);
      }

      const getDetails = await this.paydayloanRepo.findOne({ where: { id } });
      const user = await this.userRepo.findOne({
        where: { id: getDetails.user_id },
      });

      if (updateDetails.affected > 0) {
        await this.notiService.sendUserNot(
          user.id,
          `Your payday laon was updated successfully`,
        );
      }

      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'update successful',
        data: getDetails,
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

  // delete a particular loan
  async deleteLoan(id: string): Promise<IReturnObject> {
    try {
      const user = await this.paydayloanRepo.findOne({ where: { id } });
      const deletedItem = await this.paydayloanRepo.delete({ id });
      if (deletedItem.affected > 0) {
        await this.notiService.sendUserNot(
          user.user_id,
          `You have successfully deleted payday loan with id ${id}`,
        );
      }
      return Return({
        error: deletedItem.affected > 0 ? false : true,
        statusCode: deletedItem.affected > 0 ? 200 : 400,
        errorMessage:
          deletedItem.affected > 0 ? null : 'Not deleted, try again',
        successMessage: deletedItem.affected > 0 ? 'deleted' : null,
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

  async getdraftsLoan(id: string): Promise<IReturnObject> {
    try {
      const data = await this.paydayloanRepo.find({
        where: { user_id: id, draft: true },
      });
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'paydayloan drafts',
        data: data,
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

  async getdraftLoan(id: string): Promise<IReturnObject> {
    try {
      const data = await this.paydayloanRepo.findOne({
        where: { id, draft: true },
      });
      if (data === undefined) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'Not found',
        });
      }
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'paydayloan drafts',
        data: data,
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

  // files upload
  async handleFiles(id: string, files: Files): Promise<void> {
    const loan = await this.paydayloanRepo.findOne({ where: { id } });

    for (const key in files) {
      const filename = files[key][0].filename;
      const originalName = files[key][0].originalname;
      const fieldname = files[key][0].fieldname;

      // check if the filename exist
      const uploadedFileExists = existsSync(
        join(process.cwd(), `./docs/${filename}`),
      );

      if (uploadedFileExists) {
        // check if the folder exist
        const profilePicExist = existsSync(
          join(process.cwd(), `./public/${fieldname}/${loan.id}`),
        );

        if (profilePicExist) {
          // remove the directory
          rmdirSync(join(process.cwd(), `./public/${fieldname}/${loan.id}`), {
            recursive: true,
          });
          // make the direcotry
          mkdirSync(join(process.cwd(), `./public/${fieldname}/${loan.id}`));
          // copy new item
          copyFileSync(
            join(process.cwd(), `./docs/${filename}`),
            join(
              process.cwd(),
              `./public/${fieldname}/${
                loan.id
              }/${filename}-${fieldname}${extname(originalName)}`,
            ),
          );

          const path = `${FILE_URL}/${fieldname}/${
            loan.id
          }/${filename}-${fieldname}${extname(originalName)}`;

          switch (fieldname) {
            case 'company_id': {
              const up = await this.paydayloanRepo
                .createQueryBuilder('loan')
                .update()
                .set({ company_id: path })
                .where({ id: loan.id })
                .execute();
              break;
            }
            case 'government_ID': {
              const up = await this.paydayloanRepo
                .createQueryBuilder('loan')
                .update()
                .set({ government_ID: path })
                .where({ id: loan.id })
                .execute();
              break;
            }
            case 'HR_letter_of_employement': {
              const up = await this.paydayloanRepo
                .createQueryBuilder('loan')
                .update()
                .set({ HR_letter_of_comfirmation: path })
                .where({ id: loan.id })
                .execute();
              break;
            }
            case 'letter_of_employment': {
              const up = await this.paydayloanRepo
                .createQueryBuilder('loan')
                .update()
                .set({ letter_of_employment: path })
                .where({ id: loan.id })
                .execute();
              break;
            }
            case 'passport': {
              const up = await this.paydayloanRepo
                .createQueryBuilder('loan')
                .update()
                .set({ passport: path })
                .where({ id: loan.id })
                .execute();
              break;
            }
            case 'utility_bill': {
              const up = await this.paydayloanRepo
                .createQueryBuilder('loan')
                .update()
                .set({ utility_bill: path })
                .where({ id: loan.id })
                .execute();
              break;
            }
          }
        } else {
          // make the direcotry
          mkdirSync(join(process.cwd(), `./public/${fieldname}/${loan.id}`));
          // copy new item
          copyFileSync(
            join(process.cwd(), `./docs/${filename}`),
            join(
              process.cwd(),
              `./public/${fieldname}/${
                loan.id
              }/${filename}-${fieldname}${extname(originalName)}`,
            ),
          );

          const path = `${FILE_URL}/${fieldname}/${
            loan.id
          }/${filename}-${fieldname}${extname(originalName)}`;

          switch (fieldname) {
            case 'company_id': {
              const up = await this.paydayloanRepo
                .createQueryBuilder('loan')
                .update()
                .set({ company_id: path })
                .where({ id: loan.id })
                .execute();
              break;
            }
            case 'government_ID': {
              const up = await this.paydayloanRepo
                .createQueryBuilder('loan')
                .update()
                .set({ government_ID: path })
                .where({ id: loan.id })
                .execute();
              break;
            }
            case 'HR_letter_of_employement': {
              const up = await this.paydayloanRepo
                .createQueryBuilder('loan')
                .update()
                .set({ HR_letter_of_comfirmation: path })
                .where({ id: loan.id })
                .execute();
              break;
            }
            case 'letter_of_employment': {
              const up = await this.paydayloanRepo
                .createQueryBuilder('loan')
                .update()
                .set({ letter_of_employment: path })
                .where({ id: loan.id })
                .execute();
              break;
            }
            case 'passport': {
              const up = await this.paydayloanRepo
                .createQueryBuilder('loan')
                .update()
                .set({ passport: path })
                .where({ id: loan.id })
                .execute();
              break;
            }
            case 'utility_bill': {
              const up = await this.paydayloanRepo
                .createQueryBuilder('loan')
                .update()
                .set({ utility_bill: path })
                .where({ id: loan.id })
                .execute();
              break;
            }
          }
        }
      }
    }
  }
}
