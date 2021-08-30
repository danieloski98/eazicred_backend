import { Injectable, Logger } from '@nestjs/common';
//import { MailerService } from '@nestjs-modules/mailer';
import { IReturnObject } from 'src/utils/ReturnObject';
import { Return } from 'src/utils/Returnfunctions';
import { ContactForm } from 'src/Types/Contactform';
// import { join } from 'path';
import { User } from 'src/Schema/User.entity';
import * as nodemailer from 'nodemailer';
import * as Mg from 'nodemailer-mailgun-transport';
import { MailOptions } from 'nodemailer/lib/ses-transport';
import { sendCreationEmail } from 'src/templates/sendCreationMail';
import { sendResetLink } from 'src/templates/sendPasswordReset';
import { sendSuccessEmail } from 'src/templates/Loanapplicationemail';
import { ApplicationSuccessful } from 'src/templates/ApplicationSuccessful';
import { ApplicationDeclined } from 'src/templates/ApplicationDeclined';
import { AdminLoanSuccess } from 'src/templates/AdminLoanSuccess';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Injectable()
export class EmailService {
  logger = new Logger();
  private auth = {
    auth: {
      username: 'contact@support.eazicred.com',
      password: 'DandollaEmma',
      api_key: process.env.KEY,
      domain: process.env.DOMAIN,
    },
  };

  //private transporter = nodemailer.createTransport(Mg(this.auth));
  private transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 25,
    secure: false,
    auth: {
      user: 'contact@support.eazicred.com',
      pass: process.env.MAILGUN_PASSWORD,
    },
  });

  public async sendConfirmationEmail(body: User): Promise<IReturnObject> {
    try {
      const mailOption: MailOptions = {
        from: 'eazicred@gmail.com',
        to: body.email,
        subject: `Account creation Successful`,
        html: sendCreationEmail(body),
      };
      this.transporter.sendMail(mailOption, (error: any, info: any) => {
        if (error) {
          this.logger.error(error);
        } else {
          this.logger.log(info);
        }
      });
      return Return({
        error: false,
        successMessage: 'Account creation email sent',
        statusCode: 200,
      });
    } catch (error) {
      return Return({
        error: true,
        statusCode: 500,
        trace: error,
        errorMessage: 'Internal Server error',
      });
    }
  }

  public async sendSupportEmail(support: ContactForm): Promise<IReturnObject> {
    try {
      const mailOption: MailOptions = {
        from: `${support.email}`,
        to: `eazicred@gmail.com`,
        subject: `Support form message from ${support.name}`,
        html: `<p>${support.message}</p>`,
      };
      const email = this.transporter.sendMail(
        mailOption,
        (error: any, info: any) => {
          if (error) {
            this.logger.error(error);
          } else {
            this.logger.log(info);
          }
        },
      );
      return Return({
        error: false,
        data: email,
        successMessage: 'Email sent',
        statusCode: 200,
      });
    } catch (error) {
      this.logger.error(error);
      return Return({
        error: true,
        statusCode: 500,
        trace: error,
        errorMessage: 'Internal Server error',
      });
    }
  }

  public async sendResetEmail(body: User): Promise<IReturnObject> {
    try {
      const mailOption: MailOptions = {
        from: 'support@eazicred.com',
        to: body.email,
        subject: `Password reset`,
        html: sendResetLink(body),
      };
      this.transporter.sendMail(mailOption, (error: any, info: any) => {
        if (error) {
          this.logger.error(error);
        } else {
          this.logger.log(info);
        }
      });
      return Return({
        error: false,
        successMessage: 'Account creation email sent',
        statusCode: 200,
      });
    } catch (error) {
      return Return({
        error: true,
        statusCode: 500,
        trace: error,
        errorMessage: 'Internal Server error',
      });
    }
  }

  public async sendSuccessEmail(
    email: string,
    loanType: 'Payday Loan' | 'SME Loan',
  ): Promise<IReturnObject> {
    try {
      console.log(process.env.EMAIL);
      const mailOption: MailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Loan Application`,
        html: sendSuccessEmail(loanType),
      };
      // const res = await this.mg.messages.create(
      //   'sandbox69ad51e92cf34635b7d8e6b3fb007014.mailgun.org',
      //   mailOption,
      // );
      // console.log(res);
      this.transporter.sendMail(mailOption, (error: any, info: any) => {
        if (error) {
          console.log(error);
          // this.logger.error(error);
        } else {
          this.logger.log(info);
        }
      });

      return Return({
        error: false,
        successMessage: 'Email Sent! to',
        statusCode: 200,
      });
    } catch (error) {
      console.log(error);
      return Return({
        error: true,
        statusCode: 500,
        trace: error,
        errorMessage: 'Internal Server error',
      });
    }
  }

  public async sendAdminSuccessEmail(
    email: string,
    loan_id: string,
    loanType: 'Payday Loan' | 'SME Loan',
  ): Promise<IReturnObject> {
    try {
      const mailOption: MailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: `Loan Application`,
        html: AdminLoanSuccess(email, loan_id, loanType),
      };
      this.transporter.sendMail(mailOption, (error: any, info: any) => {
        if (error) {
          console.log(error);
          // this.logger.error(error);
        } else {
          this.logger.log(info);
        }
      });
      return Return({
        error: false,
        successMessage: 'Email Sent!',
        statusCode: 200,
      });
    } catch (error) {
      console.log(error);
      return Return({
        error: true,
        statusCode: 500,
        trace: error,
        errorMessage: 'Internal Server error',
      });
    }
  }

  public async sendGrantEmail(
    loan_id: string,
    email: string,
    loanType: 'Payday Loan' | 'SME Loan',
  ): Promise<IReturnObject> {
    try {
      const mailOption: MailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Loan Application`,
        html: ApplicationSuccessful(loan_id, loanType),
      };
      this.transporter.sendMail(mailOption, (error: any, info: any) => {
        if (error) {
          console.log(error);
          // this.logger.error(error);
        } else {
          this.logger.log(info);
        }
      });
      return Return({
        error: false,
        successMessage: 'Email Sent!',
        statusCode: 200,
      });
    } catch (error) {
      console.log(error);
      return Return({
        error: true,
        statusCode: 500,
        trace: error,
        errorMessage: 'Internal Server error',
      });
    }
  }

  public async sendDeclinedEmail(
    loan_id: string,
    email: string,
    loanType: 'Payday Loan' | 'SME Loan',
  ): Promise<IReturnObject> {
    try {
      const mailOption: MailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Loan Application`,
        html: ApplicationDeclined(loan_id, loanType),
      };
      this.transporter.sendMail(mailOption, (error: any, info: any) => {
        if (error) {
          console.log(error);
          // this.logger.error(error);
        } else {
          this.logger.log(info);
        }
      });
      return Return({
        error: false,
        successMessage: 'Email Sent!',
        statusCode: 200,
      });
    } catch (error) {
      console.log(error);
      return Return({
        error: true,
        statusCode: 500,
        trace: error,
        errorMessage: 'Internal Server error',
      });
    }
  }
}
