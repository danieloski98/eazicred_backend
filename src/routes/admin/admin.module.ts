import { ContactFormDetails } from './../../Schema/contact.entity';
import { AdmincheckMiddleware } from './../../middleware/admin.middleware';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/Schema/Admin.entity';
import { User } from 'src/Schema/User.entity';
import { UserService } from '../auth/services/user/user.service';
import { AdminController } from './admin/admin.controller';
import { CrudService } from './services/crud/crud.service';
import { AgentService } from './services/agent/agent.service';
import { Agent } from 'src/Schema/Agent.entity';
import { PayDayLoan } from 'src/Schema/PaydayLaon.entity';
import { SMELOAN } from 'src/Schema/SME.entity';
import { LoansService } from './services/loans/loans.service';
import { UserNotiService } from '../notifications/services/user/user.service';
import { Notification } from 'src/Schema/Notification.entity';
import { EmailService } from './services/email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      User,
      Agent,
      PayDayLoan,
      SMELOAN,
      Notification,
      ContactFormDetails,
    ]),
  ],
  controllers: [AdminController],
  providers: [
    CrudService,
    UserService,
    AgentService,
    LoansService,
    UserNotiService,
    EmailService,
  ],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdmincheckMiddleware).forRoutes(
      // { path: 'admin', method: RequestMethod.POST },
      { path: 'admin/createagent', method: RequestMethod.POST },
      {
        path: 'admin/:agent_id',
        method: RequestMethod.PUT,
      },
      {
        path: 'admin/:agent_id',
        method: RequestMethod.DELETE,
      },
      {
        path: 'admin/agents',
        method: RequestMethod.GET,
      },
      {
        path: 'admin/users',
        method: RequestMethod.GET,
      },
      {
        path: 'admin/user/:email',
        method: RequestMethod.GET,
      },
    );
  }
}
