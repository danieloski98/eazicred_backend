import { Controller, Get, Param, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Agent } from 'src/Schema/Agent.entity';
import { Return } from 'src/utils/Returnfunctions';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';

@Controller('agent')
export class AgentController {
  constructor(@InjectRepository(Agent) private agentRepo: Repository<Agent>) {}

  @Get(':email')
  async getAdminByemail(@Res() res: Response, @Param() param: any) {
    try {
      const email = param['email'];
      const exisit = await this.agentRepo.find({
        where: { email },
        relations: ['smeloans', 'paydayloans'],
      });
      if (exisit.length < 1) {
        const error = Return({
          error: true,
          errorMessage: 'Agent not found',
          statusCode: 400,
        });
        res.status(error.statusCode).send(error);
        return;
      } else {
        // generate jwt
        const token = await this.generateJWT({
          id: exisit[0].id,
          email: exisit[0].email,
          agent: true,
        });
        const success = Return({
          error: false,
          successMessage: 'Agent found',
          statusCode: 200,
          data: {
            ...exisit[0],
            token,
          },
        });
        res.status(success.statusCode).send(success);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(
        Return({
          error: true,
          statusCode: 500,
          errorMessage: 'Internal server error',
          trace: error,
        }),
      );
    }
  }

  public async generateJWT(payload: Partial<any>): Promise<string> {
    const JWT = sign(payload, 'EAZICRED', {
      algorithm: 'HS256',
      expiresIn: '5h',
    });
    return JWT;
  }
}
