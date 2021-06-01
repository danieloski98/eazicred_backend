import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Schema/User.entity';
import { Return } from 'src/utils/Returnfunctions';
import { IReturnObject } from 'src/utils/ReturnObject';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { compare, compareSync, genSaltSync, hash } from 'bcrypt';
import { Admin } from 'src/Schema/Admin.entity';

@Injectable()
export class UserService {
  private logger = new Logger();
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async createAccount(userDetails: User): Promise<IReturnObject> {
    try {
      // check if there is an account with that email
      const emailInUse = await this.userRepo.find({
        where: { email: userDetails.email },
      });
      if (emailInUse.length >= 1) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'Email already in use',
        });
      }

      //check for first and lastname
      if (
        userDetails.firstname === undefined ||
        userDetails.lastname === undefined
      ) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'First and lastname is required',
        });
      }

      // check password
      if (userDetails.password.length < 8) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'Password not acceptable',
        });
      }

      // hash the password
      const newPassword = await this.generateHashedPassword(
        userDetails.password,
      );
      // send email
      // construct new user
      const newUser = {
        email: userDetails.email,
        password: newPassword,
        firstname: userDetails.firstname,
        lastname: userDetails.lastname,
        phone: userDetails.phone,
      };
      // create the record
      const savedUser = await this.userRepo.save(newUser);
      delete savedUser.password;

      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'Account created',
        data: savedUser,
      });
    } catch (error) {
      return Return({
        error: true,
        statusCode: 500,
        errorMessage: 'Internal Server error occured',
        trace: error,
      });
    }
  }

  public async loginUser(payload: Partial<User>): Promise<IReturnObject> {
    try {
      // check if an account with the email exisits
      const accountExisit = await this.userRepo.findOne({
        where: { email: payload.email },
        relations: ['SMEloans', 'paydayloans'],
      });
      if (accountExisit === undefined) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'Account not found.',
        });
      }

      // verify the password
      const existingPassword = accountExisit.password;
      const passwordMatch = compareSync(payload.password, existingPassword);

      if (!passwordMatch) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'Invalid email or password.',
        });
      } else {
        // generate jwt
        delete accountExisit.password;
        delete accountExisit.created_at;
        payload['id'] = accountExisit.id;
        this.logger.warn(typeof accountExisit);
        const jwt = await this.generateJWT(payload);

        return Return({
          error: false,
          statusCode: 200,
          successMessage: 'Login successful',
          data: {
            token: jwt,
            user: accountExisit,
          },
        });
      }
    } catch (error) {
      return Return({
        error: true,
        statusCode: 500,
        trace: error,
        errorMessage: 'Internal Server error.',
      });
    }
  }

  async changePassword(
    user_id: string,
    payload: { oldpassword: string; newpassword: string },
  ): Promise<IReturnObject> {
    try {
      // check if the user does exist
      const userExist = await this.userRepo.find({
        where: { id: user_id },
      });
      if (userExist.length < 1) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'User not found',
        });
      } else {
        // check the old password
        const passwordCheck = await compare(
          payload.oldpassword,
          userExist[0].password,
        );

        const samePassword = await compare(
          payload.newpassword,
          userExist[0].password,
        );

        if (!passwordCheck) {
          return Return({
            error: true,
            statusCode: 400,
            errorMessage: 'Passwords do not match',
          });
        } else if (samePassword) {
          return Return({
            error: true,
            statusCode: 400,
            errorMessage: "You can't use an old password",
          });
        } else if (payload.newpassword.length < 8) {
          return Return({
            error: true,
            statusCode: 400,
            errorMessage:
              'Invalid password, password should be upto 8 alphanumeric characters.',
          });
        } else {
          // hash the new Password
          const hash = await this.generateHashedPassword(payload.newpassword);

          const updatedUser = await this.userRepo.update(
            { id: userExist[0].id },
            { password: hash },
          );
          this.logger.log(updatedUser);
          return Return({
            error: false,
            statusCode: 200,
            successMessage: 'Password updated',
          });
        }
      }
    } catch (error) {
      return Return({
        error: true,
        statusCode: 500,
        trace: error,
        errorMessage: 'Internal Server error.',
      });
    }
  }

  public async generateJWT(
    payload: Partial<User> | Partial<Admin>,
  ): Promise<string> {
    this.logger.warn(payload);
    const JWT = sign(payload, 'EAZICRED', {
      algorithm: 'HS256',
      expiresIn: '2h',
    });
    return JWT;
  }

  public async generateHashedPassword(password: string): Promise<string> {
    const salt = genSaltSync(10);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  }
}
