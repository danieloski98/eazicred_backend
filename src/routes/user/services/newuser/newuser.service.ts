import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/routes/auth/services/user/user.service';
import { User } from 'src/Schema/User.entity';
import { Return } from 'src/utils/Returnfunctions';
import { IReturnObject } from 'src/utils/ReturnObject';
import { Repository } from 'typeorm';

@Injectable()
export class NewuserService {
  private logger = new Logger('USER:NEWUSERSERVICE');
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private authService: UserService,
  ) {}

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
}
