import { Injectable, Logger } from '@nestjs/common';
//import { MailerService } from '@nestjs-modules/mailer';
import { IReturnObject } from 'src/utils/ReturnObject';
import { Return } from 'src/utils/Returnfunctions';
import { ContactForm } from 'src/Types/Contactform';
import { join } from 'path';
import { User } from 'src/Schema/User.entity';
import * as nodemailer from 'nodemailer';
import * as Mg from 'nodemailer-mailgun-transport';
import { MailOptions } from 'nodemailer/lib/ses-transport';
require('dotenv').config();

console.log(process.env.KEY);

@Injectable()
export class EmailService {
  logger = new Logger();
  private auth = {
    auth: {
      api_key: process.env.KEY,
      domain: process.env.DOMAIN,
    },
  };
  private transporter = nodemailer.createTransport(Mg(this.auth));
  // constructor(private readonly mailerService: MailerService) {}

  public async sendConfirmationEmail(
    body: User,
    code: string,
  ): Promise<IReturnObject> {
    try {
      // nodemailer.sendEmail({
      //   auth: {
      //     user: process.env.SMTP_USER_NAME,
      //     pass: process.env.SMTP_USER_PASS,
      //   },
      //   from: 'contact@eazicred.com',
      //   to: 'danielemmanuel257@gmail.com',
      //   subject: 'Hey you, awesome!',
      //   html: '<b>This is bold text</b>',
      //   text: 'This is text version!',
      //   replyTo: 'receiverXXX@gmail.com',
      //   onError: (e: any) => {
      //     console.log(e);
      //   },
      //   onSuccess: (i: any) => {
      //     console.log(i);
      //   },
      // });
      // // const email = await this.mailerService.sendMail({
      //   to: 'danielemmanuel257@gmail.com',
      //   from: 'contact@eazicred.com',
      //   subject: 'Account Creation',
      //   template: join(process.cwd(), '/src/templates/index'), // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
      //   context: {
      //     firstname: body.firstname,
      //     lastname: body.lastname,
      //     email: body.email,
      //     code: code,
      //   },
      // });
      return Return({
        error: false,
        // data: email,
        successMessage: 'Email sent',
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
        to: `support@eazicred.com`,
        subject: `Support form message from ${support.name}`,
        html: `<p>${support.message}</p>`,
      };

      // const email = await this.mailerService.sendMail({
      //   to: 'danielemmanuel257@gmail.com',
      //   from: 'support@eazicred.com',
      //   subject: `Support message from ${support.email}`,
      //   template: join(process.cwd(), '/src/templates/support'),
      //   context: support, // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
      // });
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
}
