import { Injectable } from '@nestjs/common';
import { IReturnObject } from 'src/utils/ReturnObject';
import { Return } from 'src/utils/Returnfunctions';
import * as joi from 'joi';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from 'src/Schema/Agent.entity';
import { Repository } from 'typeorm';

export const adminValidator = joi.object({
  email: joi.string().required().email(),
  firstname: joi.string().required(),
  lastname: joi.string().required(),
  // password: joi.string().required().min(8),
});

@Injectable()
export class AgentService {
  constructor(@InjectRepository(Agent) private agentRepo: Repository<Agent>) {}

  // create admin
  async createAgent(admin: Agent): Promise<IReturnObject> {
    try {
      // check if that email is in use
      const emailCheck = await this.agentRepo.find({
        where: { email: admin.email },
      });
      if (emailCheck.length > 0) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'Email already in use by another agent',
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

      // create entry
      const newAmdin = await this.agentRepo.save(admin);

      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'Agent created',
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

  async updateAgent(
    id: number,
    payload: Partial<Agent>,
  ): Promise<IReturnObject> {
    try {
      const idCheck = await this.agentRepo.findOne({ where: { id } });
      if (idCheck === undefined) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'Agent not found',
        });
      }

      const updated = await this.agentRepo
        .createQueryBuilder()
        .update()
        .set({ ...payload })
        .where({ id })
        .execute();
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'agent updated',
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

  async deleteAgent(id: string): Promise<IReturnObject> {
    try {
      const idCheck = await this.agentRepo.findOne({ where: { id } });
      if (idCheck === undefined) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'Agent not found',
        });
      }

      const updated = await this.agentRepo.delete({ id });
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'agent deleted',
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

  async getAgents(): Promise<IReturnObject> {
    try {
      const agents = await this.agentRepo.find();
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'Agents',
        data: agents,
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
