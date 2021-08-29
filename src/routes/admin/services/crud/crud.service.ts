import { ContactFormDetails } from './../../../../Schema/contact.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/Schema/Admin.entity';
import { Repository } from 'typeorm';
import * as joi from 'joi';
import { IReturnObject } from 'src/utils/ReturnObject';
import { Return } from 'src/utils/Returnfunctions';
import { UserService } from 'src/routes/auth/services/user/user.service';
import { compareSync } from 'bcrypt';

export const adminValidator = joi.object({
  email: joi.string().required().email(),
  firstname: joi.string().required(),
  lastname: joi.string().required(),
  password: joi.string().required().min(8),
});

@Injectable()
export class CrudService {
  constructor(
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    @InjectRepository(ContactFormDetails)
    private contactRepo: Repository<ContactFormDetails>,
    private userService: UserService,
  ) {}

  // create admin
  async createAdmin(admin: Admin): Promise<IReturnObject> {
    try {
      // check if that email is in use
      const emailCheck = await this.adminRepo.find({
        where: { email: admin.email },
      });
      if (emailCheck.length > 0) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'Email already in use',
        });
      }

      // validate
      const validation = adminValidator.validate(admin);
      if (validation.error) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: validation.error.message,
          trace: validation.error,
        });
      }

      // hash password
      const newPassword = await this.userService.generateHashedPassword(
        admin.password,
      );
      admin.password = newPassword;

      // create entry
      const newAmdin = await this.adminRepo.save(admin);

      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'Admin created',
        data: newAmdin,
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

  // Login Admin

  async login(admin: Partial<Admin>): Promise<IReturnObject> {
    try {
      // check email
      const emailCheck = await this.adminRepo.find({
        where: { email: admin.email },
      });
      console.log(emailCheck);
      if (emailCheck.length < 1) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'Invalid Email or Password!',
        });
      }

      // check password
      const match = compareSync(admin.password, emailCheck[0].password);
      if (!match) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'Invalid Email or Password!!!',
        });
      }

      admin['id'] = emailCheck[0].id;
      console.log(admin);

      // generate token
      const token = await this.userService.generateJWT(admin);

      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'Login Successful',
        data: {
          token,
          amdin: emailCheck[0],
        },
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

  async getAllAdmins(id: string): Promise<IReturnObject> {
    try {
      const admins = await this.adminRepo.find();
      const notI = admins.filter((item) => item.id !== id);
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'Admins',
        data: notI,
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

  async contact(contact: ContactFormDetails): Promise<IReturnObject> {
    try {
      const newContact = await this.contactRepo.save(contact);
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'Message sent',
        data: newContact,
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

  async getMessages(): Promise<IReturnObject> {
    try {
      const newContact = await this.contactRepo.find();
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'Messages',
        data: newContact,
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
