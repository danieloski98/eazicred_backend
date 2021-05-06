import { LoansService } from './../services/loans/loans.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Admin } from 'src/Schema/Admin.entity';
import { Agent } from 'src/Schema/Agent.entity';
import { AgentService } from '../services/agent/agent.service';
import { CrudService } from '../services/crud/crud.service';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: CrudService,
    private agentService: AgentService,
    private loanService: LoansService,
  ) {}

  // GET ROUTES
  @Get('agents')
  @ApiTags('ADMIN')
  @ApiOkResponse({ description: 'Admin Created Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  async getAgents(@Res() res: Response) {
    const result = await this.agentService.getAgents();
    res.status(result.statusCode).send(result);
  }

  @Get('agents')
  @ApiTags('ADMIN')
  @ApiOkResponse({ description: 'Admin Created Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  async getAdmins(@Res() res: Response, @Req() req: Request) {
    const user = req['user'];
    const result = await this.adminService.getAllAdmins(user);
    res.status(result.statusCode).send(result);
  }

  @Get('SMEloans')
  @ApiTags('ADMIN')
  @ApiOkResponse({ description: 'Admin Created Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  async getSMEloans(@Res() res: Response) {
    const result = await this.loanService.getSMELoans();
    res.status(result.statusCode).send(result);
  }

  @Get('paydayloans')
  @ApiTags('ADMIN')
  @ApiOkResponse({ description: 'Admin Created Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  async getPaydayloans(@Res() res: Response) {
    const result = await this.loanService.getpaydayloansLoans();
    res.status(result.statusCode).send(result);
  }

  @Get('SMEloan/:loan_id')
  @ApiTags('ADMIN')
  @ApiParam({ name: 'loan_id', type: String })
  @ApiOkResponse({ description: 'Admin Created Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  async getSMEloan(@Res() res: Response, @Param() param: any) {
    const result = await this.loanService.getSMELoan(param['loan_id']);
    res.status(result.statusCode).send(result);
  }

  @Get('payday/:loan_id')
  @ApiTags('ADMIN')
  @ApiParam({ name: 'loan_id', type: String })
  @ApiOkResponse({ description: 'Admin Created Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  async getpaydayloan(@Res() res: Response, @Param() param: any) {
    const result = await this.loanService.getpaydayloansLoan(param['loan_id']);
    res.status(result.statusCode).send(result);
  }

  // POST ROutes
  @Post()
  @ApiTags('ADMIN')
  @ApiOkResponse({ description: 'Admin Created Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  @ApiBody({ type: Admin })
  async createAdmin(@Res() res: Response, @Body() body: Admin) {
    const result = await this.adminService.createAdmin(body);
    res.status(result.statusCode).send(result);
  }

  @Post('login')
  @ApiTags('ADMIN')
  @ApiOkResponse({ description: 'Admin login Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  @ApiBody({ type: Admin })
  async loginAdmin(@Res() res: Response, @Body() body: Admin) {
    const result = await this.adminService.login(body);
    res.status(result.statusCode).send(result);
  }

  @Post('createagent')
  @ApiTags('ADMIN')
  @ApiOkResponse({ description: 'Admin login Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  @ApiBody({ type: Admin })
  async createAgent(@Res() res: Response, @Body() body: Agent) {
    const result = await this.agentService.createAgent(body);
    res.status(result.statusCode).send(result);
  }

  // PUT ROUTES
  @Put('agent/:agent_id')
  @ApiTags('ADMIN')
  @ApiParam({ name: 'agent_id', type: String })
  @ApiBody({ type: Agent })
  @ApiOkResponse({ description: 'Admin login Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  async updateagent(
    @Res() res: Response,
    @Body() body: Agent,
    @Param() param: any,
  ) {
    const result = await this.agentService.updateAgent(param['agent_id'], body);
    res.status(result.statusCode).send(result);
  }

  // DELETE ROutes
  @Delete('agent/:agent_id')
  @ApiTags('ADMIN')
  @ApiParam({ name: 'agent_id', type: String })
  @ApiOkResponse({ description: 'Admin login Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  async deleteagent(
    @Res() res: Response,
    @Body() body: Agent,
    @Param() param: any,
  ) {
    const result = await this.agentService.deleteAgent(param['agent_id']);
    res.status(result.statusCode).send(result);
  }
}
