import { User } from './../Schema/User.entity';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { Return } from 'src/utils/Returnfunctions';
import { Repository } from 'typeorm';
import { Admin } from 'src/Schema/Admin.entity';

@Injectable()
export class AdmincheckMiddleware implements NestMiddleware {
  private logger = new Logger('UserCheckMiddleWare');
  constructor(@InjectRepository(Admin) private userRepo: Repository<Admin>) {}
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

    try {
      // verify the token
      const verifiedtoken: Partial<Admin> = verify(token, 'EAZICRED', {
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
      const user = await this.userRepo.findOne({
        where: { id: verifiedtoken.id },
      });

      if (user === undefined) {
        const payload = Return({
          error: true,
          statusCode: 400,
          errorMessage: 'Admin Not Found',
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
