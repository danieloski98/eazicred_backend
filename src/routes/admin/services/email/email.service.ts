import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IReturnObject } from 'src/utils/ReturnObject';
import { Return } from 'src/utils/Returnfunctions';
import { ContactForm } from 'src/Types/Contactform';
import { join } from 'path';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  public async example(body: ContactForm): Promise<IReturnObject> {
    try {
      const email = await this.mailerService.sendMail({
        to: 'test@nestjs.com',
        from: 'noreply@nestjs.com',
        subject: 'Testing Nest Mailermodule with template ✔',
        template: join(process.cwd(), '/src/templates/contact'), // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
        context: {
          // Data to be sent to template engine.
          code: 'cf1a3f828287',
          username: body.name,
        },
      });
      return Return({
        error: false,
        data: email,
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
}
