import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  private mailTransporter = createTransport({
    service: 'gmail',
    auth: {
      user: 'danielemmanuel257@gmail.com',
      pass: 'Daniel08033634507',
    },
  });

  async sendEmail(): Promise<any> {
    try {
      const mailDetails = {
        from: 'danielemmanuel257@gmail.com',
        to: 'dandolla98@gmail.com',
        subject: 'Test mail',
        text: 'Node.js testing mail for GeeksforGeeks',
      };
      const email = await this.mailTransporter.sendMail(mailDetails);
      return email;
    } catch (error) {
      return error;
    }
  }
}
