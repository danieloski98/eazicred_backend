import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './routes/auth/auth.module';
import { UserModule } from './routes/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './routes/admin/admin.module';
import { NotificationsModule } from './routes/notifications/notifications.module';
import { EmailService } from './globalservices/email/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

console.log(process.env.SMTP_PORT);

@Module({
  imports: [
    MailerModule.forRoot({
      transport: `smtp://${process.env.SMTP_USER_NAME}:${process.env.SMTP_USER_PASS}@${process.env.SMTP_HOST}`,
      defaults: {
        from: 'contact@eazicred.com',
      },
      template: {
        dir: join(process.cwd(), '/src/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      username: 'daniel',
      password: 'daniel98',
      database: 'loanapp',
      synchronize: true,
      autoLoadEntities: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
      entityPrefix: 'la_',
    }),
    AuthModule,
    UserModule,
    AdminModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
