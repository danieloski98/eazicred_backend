import { Injectable, Logger } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Schema/User.entity';
import { Return } from 'src/utils/Returnfunctions';
import { IReturnObject } from 'src/utils/ReturnObject';
import { Repository } from 'typeorm';
import { compareSync, genSaltSync, hash } from 'bcrypt';

export class PasswordUpdatePayload {
  @ApiProperty()
  oldpassword: string;

  @ApiProperty()
  newpassword: string;
}

@Injectable()
export class UserService {
  private logger = new Logger('USER:USERSERVICE');
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  public async getUserDetails(id: string): Promise<IReturnObject> {
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
      this.logger.log(id);
      this.logger.log(payload);
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

      delete user.password;

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

  public async updatePassword(
    id: string,
    payload: PasswordUpdatePayload,
  ): Promise<IReturnObject> {
    try {
      // get user details
      const user = await this.userRepo.findOne({ where: { id } });
      // check if the new password = existing password
      const comparePass = compareSync(payload.newpassword, user.password);
      if (comparePass) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: "Can't use an old password",
        });
      }

      // compare old password = existing password
      const oldCompare = compareSync(payload.oldpassword, user.password);
      if (!oldCompare) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'the old password did not match',
        });
      }

      // check the length of the new password
      if (payload.newpassword.length < 8) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'Password length too short. Must be 8 charaters',
        });
      }

      // hash the password
      const newPassword = await this.generateHashedPassword(
        payload.newpassword,
      );

      // update the passwordfiled
      const updated = await this.userRepo
        .createQueryBuilder()
        .update()
        .set({ password: newPassword })
        .where({ id })
        .execute();

      return Return({
        error: false,
        statusCode: 200,
        successMessage:
          updated.affected > 1
            ? 'Password changed'
            : 'update failed, try again',
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

  public async generateHashedPassword(password: string): Promise<string> {
    const salt = genSaltSync(10);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  }
}
