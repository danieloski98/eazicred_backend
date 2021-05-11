import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Schema/User.entity';
import { Return } from 'src/utils/Returnfunctions';
import { IReturnObject } from 'src/utils/ReturnObject';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private logger = new Logger('USER:USERSERVICE');
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async getUserDetails(id: string): Promise<IReturnObject> {
    try {
      const userdetails = await this.userRepo.findOne({
        where: { id },
        relations: ['paydayloans', 'SMEloans'],
      });
      delete userdetails.password;
      this.logger.log(userdetails);
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'User Details',
        data: userdetails,
      });
    } catch (error) {
      return Return({
        error: true,
        statusCode: 500,
        errorMessage: 'Internal Server Error',
        trace: error,
      });
    }
  }

  async updateUserDetails(
    id: string,
    payload: Partial<User>,
  ): Promise<IReturnObject> {
    try {
      if (payload.email || payload.password) {
        delete payload.email;
        delete payload.password;
      }
      const updateUser = await this.userRepo
        .createQueryBuilder()
        .update()
        .set(payload)
        .where({ id })
        .execute();
      const user = await this.userRepo
        .createQueryBuilder()
        .where({ id })
        .getOne();

      return Return({
        error: false,
        statusCode: 200,
        successMessage:
          updateUser.affected < 1
            ? 'User details not updated'
            : 'Details updated',
        data: user,
      });
    } catch (error) {
      return Return({
        error: true,
        statusCode: 500,
        errorMessage: 'Internal Server Error',
        trace: error,
      });
    }
  }
}
