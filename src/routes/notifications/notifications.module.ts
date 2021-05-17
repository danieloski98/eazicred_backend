import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { UserNotiService } from './services/user/user.service';
import { AdminService } from './services/admin/admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/Schema/User.entity';
import { Admin } from 'src/Schema/Admin.entity';
import { Notification } from 'src/Schema/Notification.entity';
import { EmailService } from 'src/globalservices/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Admin, Notification])],
  controllers: [NotificationsController],
  providers: [UserNotiService, AdminService, EmailService],
})
export class NotificationsModule {}
