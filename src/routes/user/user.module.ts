import { SMELOAN } from './../../Schema/SME.entity';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsercheckMiddleware } from 'src/middleware/usercheck.middleware';
import { User } from 'src/Schema/User.entity';
import { UserController } from './user.controller';
import { UserService } from './services/user/user.service';
import { PaydayloansService } from './services/paydayloans/paydayloans.service';
import { SmeloansService } from './services/smeloans/smeloans.service';
import { PayDayLoan } from 'src/Schema/PaydayLaon.entity';
import { NewuserService } from './services/newuser/newuser.service';
import { UserNotiService } from '../notifications/services/user/user.service';
import { Notification } from 'src/Schema/Notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SMELOAN, PayDayLoan, Notification]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    PaydayloansService,
    SmeloansService,
    NewuserService,
    UserNotiService,
  ],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UsercheckMiddleware).forRoutes(
      { path: 'user/:id', method: RequestMethod.GET },
      { path: 'user/createSMEloan', method: RequestMethod.POST },
      { path: 'user/:id', method: RequestMethod.GET },
      { path: 'user/paydayloans/:user_id', method: RequestMethod.GET },
      { path: 'user/paydayloan/:user_id', method: RequestMethod.GET },
      { path: 'user/paydayloans/drafts', method: RequestMethod.GET },
      { path: 'user/paydayloans/draft/:loan_id', method: RequestMethod.GET },
      { path: 'user/createSMEloan', method: RequestMethod.POST },
      { path: 'user/createpaydayloan', method: RequestMethod.POST },
      { path: 'user/updatepaydayloan/:loan_id', method: RequestMethod.PUT },
      { path: 'user/updateSMEloan/:loan_id', method: RequestMethod.PUT },
      {
        path: 'user/deletepaydayloan/:loan_id',
        method: RequestMethod.DELETE,
      },
      { path: 'user/deleteSMEloan/:loan_id', method: RequestMethod.DELETE },
      { path: 'user', method: RequestMethod.PUT },
      { path: 'user/passwordupdate', method: RequestMethod.PUT },
    );
  }
}
