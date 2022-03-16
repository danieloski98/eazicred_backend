import { User } from './../Schema/User.entity';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { Return } from 'src/utils/Returnfunctions';
import { Repository } from 'typeorm';

@Injectable()
export class UsercheckMiddleware implements NestMiddleware {
  private logger = new Logger('UserCheckMiddleWare');
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  async use(req: Request, res: Response, next: () => void) {
    // get token
    // check header
    const authorization = req.headers['authorization'];

    if (authorization === undefined || authorization === null) {
      const payload = Return({
        error: true,
        statusCode: 401,
        errorMessage: 'UNAUTHORIZED REQUEST',
      });
      res.status(payload.statusCode).send(payload);
      return;
    }
    // decode string
    const token = req.headers['authorization'].split(' ')[1];
    console.log(`Token  - ${token}`);

    try {
      // verify the token
      const verifiedtoken: Partial<User | any> = verify(token, 'EAZICRED', {
        algorithms: ['HS256'],
      }) as any;
      // check the user id
      if (verifiedtoken.id === undefined) {
        const payload = Return({
          error: true,
          statusCode: 401,
          errorMessage: 'UNAUTHORIZED REQUEST',
        });
        res.status(payload.statusCode).send(payload);
        return;
      }
      if (verifiedtoken.agent) {
        next();
        return;
      }
      const user = await this.userRepo.findOne({
        where: { id: verifiedtoken.id },
      });

      if (user === undefined) {
        const payload = Return({
          error: true,
          statusCode: 400,
          errorMessage: 'User Not Found',
        });
        res.status(payload.statusCode).send(payload);
        return;
      }
      req['user'] = verifiedtoken.id;
      next();
    } catch (error) {
      const payload = Return({
        error: true,
        statusCode: 401,
        errorMessage: 'UNAUTHORIZED REQUEST',
        trace: error,
      });

      res.status(payload.statusCode).send(payload);
      return;
    }
  }
}
