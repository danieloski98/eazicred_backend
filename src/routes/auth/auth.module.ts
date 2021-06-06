import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/Schema/User.entity';
import { EmailService } from '../admin/services/email/email.service';
import { AuthController } from './auth.controller';
import { UserService } from './services/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [UserService, EmailService],
})
export class AuthModule {}
