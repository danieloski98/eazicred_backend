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
  ApiHeaders,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Admin } from 'src/Schema/Admin.entity';
import { Agent } from 'src/Schema/Agent.entity';
import { AgentService } from '../services/agent/agent.service';
import { CrudService } from '../services/crud/crud.service';
import { EmailService } from '../services/email/email.service';
import { ContactForm } from 'src/Types/Contactform';

class LoginDetails {
  @ApiProperty({
    required: true,
  })
  email: string;

  @ApiProperty({
    required: true,
  })
  password: string;
}

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: CrudService,
    private agentService: AgentService,
    private loanService: LoansService,
    private emailService: EmailService,
  ) {}

  // GET ROUTES
  @Get('agents')
  @ApiTags('ADMIN')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiOkResponse({ description: 'Admin Created Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  async getAgents(@Res() res: Response) {
    const result = await this.agentService.getAgents();
    res.status(result.statusCode).send(result);
  }

  @Get('agents')
  @ApiTags('ADMIN')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
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
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiOkResponse({ description: 'Admin Created Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  async getSMEloans(@Res() res: Response) {
    const result = await this.loanService.getSMELoans();
    res.status(result.statusCode).send(result);
  }

  @Get('paydayloans')
  @ApiTags('ADMIN')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiOkResponse({ description: 'Admin Created Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  async getPaydayloans(@Res() res: Response) {
    const result = await this.loanService.getpaydayloansLoans();
    res.status(result.statusCode).send(result);
  }

  @Get('SMEloan/:loan_id')
  @ApiTags('ADMIN')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
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
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiParam({ name: 'loan_id', type: String })
  @ApiOkResponse({ description: 'Admin Created Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  async getpaydayloan(@Res() res: Response, @Param() param: any) {
    const result = await this.loanService.getpaydayloansLoan(param['loan_id']);
    res.status(result.statusCode).send(result);
  }

  @Get('users')
  @ApiTags('ADMIN')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiOkResponse({ description: 'Admin Created Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  async getallusers(@Res() res: Response) {
    const result = await this.loanService.getAllUsers();
    res.status(result.statusCode).send(result);
  }

  @Get('user/:email')
  @ApiTags('ADMIN')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiParam({ name: 'email' })
  @ApiOkResponse({ description: 'Admin Created Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  async getalluserbyemail(@Res() res: Response, @Param() param: any) {
    const result = await this.loanService.geuserbyemail(param['email']);
    res.status(result.statusCode).send(result);
  }

  // POST ROutes
  @Post()
  @ApiTags('ADMIN')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
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
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiOkResponse({ description: 'Admin login Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  @ApiBody({ type: LoginDetails })
  async loginAdmin(@Res() res: Response, @Body() body: Admin) {
    const result = await this.adminService.login(body);
    res.status(result.statusCode).send(result);
  }

  @Post('createagent')
  @ApiTags('ADMIN')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiOkResponse({ description: 'Admin login Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  @ApiBody({ type: Agent })
  async createAgent(@Res() res: Response, @Body() body: Agent) {
    const result = await this.agentService.createAgent(body);
    res.status(result.statusCode).send(result);
  }

  @Post('support')
  @ApiTags('ADMIN')
  @ApiOkResponse({ description: 'Admin login Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  @ApiBody({ type: ContactForm })
  async sendemail(@Res() res: Response, @Body() body: ContactForm) {
    console.log(body);
    const result = await this.emailService.sendSupportEmail(body);
    res.status(result.statusCode).send(result);
  }

  // PUT ROUTES
  @Put('agent/:agent_id')
  @ApiTags('ADMIN')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
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

  @Put('status/paydayloan/:loan_id/:status')
  @ApiTags('ADMIN')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiParam({ name: 'loan_id', type: String })
  @ApiParam({
    name: 'status',
    type: Number,
    description: 'The status you are change to, either 2, or 3',
  })
  @ApiBody({ type: Agent })
  @ApiOkResponse({ description: 'Admin login Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  async updatepaydaystatus(
    @Res() res: Response,
    @Body() body: Agent,
    @Param() param: any,
  ) {
    const result = await this.loanService.statuschangepaydayloansLoan(
      param['loan_id'],
      parseInt(param['status']),
    );
    res.status(result.statusCode).send(result);
  }

  @Put('status/sme/:loan_id/:status')
  @ApiTags('ADMIN')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiParam({ name: 'loan_id', type: String })
  @ApiParam({
    name: 'status',
    type: Number,
    description: 'The status you are change to, either 2, or 3',
  })
  @ApiBody({ type: Agent })
  @ApiOkResponse({ description: 'Admin login Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  async updateSMEstatus(
    @Res() res: Response,
    @Body() body: Agent,
    @Param() param: any,
  ) {
    const result = await this.loanService.statuschangeSMEloansLoan(
      param['loan_id'],
      parseInt(param['status']),
    );
    res.status(result.statusCode).send(result);
  }

  // DELETE ROutes
  @Delete('agent/:agent_id')
  @ApiTags('ADMIN')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiParam({ name: 'agent_id', type: String })
  @ApiOkResponse({ description: 'Admin login Successfully' })
  @ApiBadRequestResponse({ description: 'An error occured check the body' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server error' })
  async deleteagent(@Res() res: Response, @Param() param: any) {
    const result = await this.agentService.deleteAgent(param['agent_id']);
    res.status(result.statusCode).send(result);
  }
}
