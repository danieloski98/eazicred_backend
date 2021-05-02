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

@Module({
  imports: [TypeOrmModule.forFeature([User, SMELOAN, PayDayLoan])],
  controllers: [UserController],
  providers: [UserService, PaydayloansService, SmeloansService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UsercheckMiddleware)
      .forRoutes(
        { path: 'user/:id', method: RequestMethod.GET },
        { path: 'user/createSMEloan', method: RequestMethod.POST },
      );
  }
}
