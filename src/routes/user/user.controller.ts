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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiHeaders,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { PayDayLoan } from 'src/Schema/PaydayLaon.entity';
import { SMELOAN } from 'src/Schema/SME.entity';
import { User } from 'src/Schema/User.entity';
import { NewuserService } from './services/newuser/newuser.service';
import {
  Files,
  PaydayloansService,
} from './services/paydayloans/paydayloans.service';
import { SmeloansService } from './services/smeloans/smeloans.service';
import {
  UserService,
  PasswordUpdatePayload,
} from './services/user/user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private SMEloanService: SmeloansService,
    private PaydayLoanService: PaydayloansService,
    private newUserService: NewuserService,
  ) {}

  // GET ROUTES

  @Get(':id')
  @ApiTags('USER')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiParam({ name: 'id', type: String, description: 'the id of the user' })
  @ApiOkResponse({ description: 'User found' })
  @ApiBadRequestResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({
    description: 'either no token or the token expired',
  })
  @ApiInternalServerErrorResponse({ description: 'Error from the server' })
  async getUser(@Req() req: Request, @Res() res: Response) {
    const user = req['user'];
    const result = await this.userService.getUserDetails(user);
    res.status(result.statusCode).send(result);
  }

  @Get('paydayloans/:user_id')
  @ApiTags('USER')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiParam({
    name: 'user_id',
    type: String,
    description: 'the id of the user',
  })
  @ApiOkResponse({ description: 'loans found' })
  @ApiBadRequestResponse({ description: 'loans not found' })
  @ApiUnauthorizedResponse({
    description: 'either no token or the token expired',
  })
  @ApiInternalServerErrorResponse({ description: 'Error from the server' })
  async getPaydayloans(@Res() res: Response, @Param() param: any) {
    const result = await this.PaydayLoanService.getpaydayloans(
      param['user_id'],
    );
    res.status(result.statusCode).send(result);
  }

  @Get('paydayloan/:loan_id')
  @ApiTags('USER')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiParam({
    name: 'loan_id',
    type: String,
    description: 'the id of the paydayloan',
  })
  @ApiOkResponse({ description: 'loans found' })
  @ApiBadRequestResponse({ description: 'loans not found' })
  @ApiUnauthorizedResponse({
    description: 'either no token or the token expired',
  })
  @ApiInternalServerErrorResponse({ description: 'Error from the server' })
  async getPaydayloan(@Res() res: Response, @Param() param: any) {
    const result = await this.PaydayLoanService.getsinglepaydayloans(
      param['loan_id'],
    );
    res.status(result.statusCode).send(result);
  }

  @Get('paydayloans/drafts')
  @ApiTags('USER')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiOkResponse({ description: 'loans found' })
  @ApiBadRequestResponse({ description: 'loans not found' })
  @ApiUnauthorizedResponse({
    description: 'either no token or the token expired',
  })
  @ApiInternalServerErrorResponse({ description: 'Error from the server' })
  async getPaydayloandrafts(@Req() req: Request, @Res() res: Response) {
    const user = req['user'];
    const result = await this.PaydayLoanService.getdraftsLoan(user);
    res.status(result.statusCode).send(result);
  }

  @Get('paydayloans/draft/:loan_id')
  @ApiTags('USER')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiParam({
    name: 'loan_id',
    type: String,
    description: 'the id of the paydayloan',
  })
  @ApiOkResponse({ description: 'loans found' })
  @ApiBadRequestResponse({ description: 'loans not found' })
  @ApiUnauthorizedResponse({
    description: 'either no token or the token expired',
  })
  @ApiInternalServerErrorResponse({ description: 'Error from the server' })
  async getPaydayloandraft(@Res() res: Response, @Param() param: any) {
    const result = await this.PaydayLoanService.getdraftLoan(param['loan_id']);
    res.status(result.statusCode).send(result);
  }

  // SME LOANS

  @Get('smeloans/:user_id')
  @ApiTags('USER')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiParam({
    name: 'user_id',
    type: String,
    description: 'the id of the user',
  })
  @ApiOkResponse({ description: 'loans found' })
  @ApiBadRequestResponse({ description: 'loans not found' })
  @ApiUnauthorizedResponse({
    description: 'either no token or the token expired',
  })
  @ApiInternalServerErrorResponse({ description: 'Error from the server' })
  async getSMEloans(@Res() res: Response, @Param() param: any) {
    const result = await this.SMEloanService.getSmeLoans(param['user_id']);
    res.status(result.statusCode).send(result);
  }

  @Get('smeloan/:loan_id')
  @ApiTags('USER')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiParam({
    name: 'loan_id',
    type: String,
    description: 'the id of the paydayloan',
  })
  @ApiOkResponse({ description: 'loans found' })
  @ApiBadRequestResponse({ description: 'loans not found' })
  @ApiUnauthorizedResponse({
    description: 'either no token or the token expired',
  })
  @ApiInternalServerErrorResponse({ description: 'Error from the server' })
  async getSMEloan(@Res() res: Response, @Param() param: any) {
    const result = await this.SMEloanService.getSingleSmeLoans(
      param['loan_id'],
    );
    res.status(result.statusCode).send(result);
  }

  @Get('smeloans/drafts')
  @ApiTags('USER')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiOkResponse({ description: 'loans found' })
  @ApiBadRequestResponse({ description: 'loans not found' })
  @ApiUnauthorizedResponse({
    description: 'either no token or the token expired',
  })
  @ApiInternalServerErrorResponse({ description: 'Error from the server' })
  async getsmeloandrafts(@Req() req: Request, @Res() res: Response) {
    const user = req['user'];
    const result = await this.SMEloanService.getdraftsSmeLoan(user);
    res.status(result.statusCode).send(result);
  }

  @Get('smeloans/draft/:loan_id')
  @ApiTags('USER')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiParam({
    name: 'loan_id',
    type: String,
    description: 'the id of the paydayloan',
  })
  @ApiOkResponse({ description: 'loans found' })
  @ApiBadRequestResponse({ description: 'loans not found' })
  @ApiUnauthorizedResponse({
    description: 'either no token or the token expired',
  })
  @ApiInternalServerErrorResponse({ description: 'Error from the server' })
  async getsmeloandraft(@Res() res: Response, @Param() param: any) {
    const result = await this.SMEloanService.getsingleDraft(param['loan_id']);
    res.status(result.statusCode).send(result);
  }

  // POST ROUTES

  @Post('createSMEloan')
  @ApiTags('USER')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiBody({ type: SMELOAN, description: 'the details for the SME load' })
  @ApiOkResponse({ description: 'loan created' })
  @ApiBadRequestResponse({
    description: 'Something happended while trying to create the loan',
  })
  @ApiUnauthorizedResponse({
    description: 'either no token or the token expired',
  })
  @ApiInternalServerErrorResponse({ description: 'Error from the server' })
  async createSMELoan(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: SMELOAN,
  ) {
    const user = req['user'];
    const result = await this.SMEloanService.createSMEloan(user, body);
    res.status(result.statusCode).send(result);
  }

  @Post('createpaydayloan')
  @ApiTags('USER')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiBody({
    type: PayDayLoan,
    description: 'the details for the paydayloan load',
  })
  @ApiOkResponse({ description: 'paydayloan created' })
  @ApiBadRequestResponse({
    description: 'Something happended while trying to create the loan',
  })
  @ApiUnauthorizedResponse({
    description: 'either no token or the token expired',
  })
  @ApiInternalServerErrorResponse({ description: 'Error from the server' })
  @ApiConsumes('multipart/formdata')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'passport', maxCount: 1 },
        { name: 'government_ID', maxCount: 1 },
        { name: 'company_id', maxCount: 1 },
        { name: 'letter_of_employment', maxCount: 1 },
        { name: 'HR_letter', maxCount: 1 },
        { name: 'utility_bill', maxCount: 1 },
      ],
      { dest: 'docs' },
    ),
  )
  async createPaydayLoan(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: PayDayLoan,
    @UploadedFiles() files: Files,
  ) {
    const user = req['user'];
    const result = await this.PaydayLoanService.createPaydayloan(
      user,
      body,
      files,
    );
    res.status(result.statusCode).send(result);
  }

  // PUT ROUTES

  @Put('updatepaydayloan/:loan_id')
  @ApiTags('USER')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiParam({ name: 'loan_id', type: String })
  @ApiBody({
    type: PayDayLoan,
    description: 'the details for the paydayloan load',
  })
  @ApiOkResponse({ description: 'paydayloan created' })
  @ApiBadRequestResponse({
    description: 'Something happended while trying to create the loan',
  })
  @ApiUnauthorizedResponse({
    description: 'either no token or the token expired',
  })
  @ApiInternalServerErrorResponse({ description: 'Error from the server' })
  @ApiConsumes('multipart/formdata')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'passport', maxCount: 1 },
        { name: 'government_ID', maxCount: 1 },
        { name: 'company_id', maxCount: 1 },
        { name: 'letter_of_employment', maxCount: 1 },
        { name: 'HR_letter', maxCount: 1 },
        { name: 'utility_bill', maxCount: 1 },
      ],
      { dest: 'docs' },
    ),
  )
  async updatePaydayLoan(
    @Res() res: Response,
    @Body() body: PayDayLoan,
    @Param() param: any,
    @UploadedFiles() files: Files,
  ) {
    const result = await this.PaydayLoanService.updatePaydayloan(
      param['loan_id'],
      body,
      files,
    );
    res.status(result.statusCode).send(result);
  }

  @Put('updateSMEloan/:loan_id')
  @ApiTags('USER')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiParam({ name: 'loan_id', type: String })
  @ApiBody({
    type: SMELOAN,
    description: 'the details for the SMEloan',
  })
  @ApiOkResponse({ description: 'SME loan updated' })
  @ApiBadRequestResponse({
    description: 'Something happended while trying to update the loan',
  })
  @ApiUnauthorizedResponse({
    description: 'either no token or the token expired',
  })
  @ApiInternalServerErrorResponse({ description: 'Error from the server' })
  async updateSMELoan(
    @Res() res: Response,
    @Param() param: any,
    @Body() body: Partial<SMELOAN>,
  ) {
    const result = await this.SMEloanService.updateSMELoan(
      param['loan_id'],
      body,
    );
    res.status(result.statusCode).send(result);
  }

  @Put('')
  @ApiTags('USER')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiBody({
    type: User,
    description: 'the details of the user for the update',
  })
  @ApiOkResponse({ description: 'user details updated' })
  @ApiBadRequestResponse({
    description: 'Something happended while trying to update the user',
  })
  @ApiUnauthorizedResponse({
    description: 'either no token or the token expired',
  })
  @ApiInternalServerErrorResponse({ description: 'Error from the server' })
  async updateUser(
    @Res() res: Response,
    @Req() req: Request,
    @Param() param: any,
    @Body() body: Partial<User>,
  ) {
    const user = req['user'];
    const result = await this.userService.updateUserDetails(user, body);
    res.status(result.statusCode).send(result);
  }

  @Put('passwordupdate')
  @ApiTags('USER')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiBody({
    type: PasswordUpdatePayload,
    description: 'the details of the user for the update',
  })
  @ApiOkResponse({ description: 'user details updated' })
  @ApiBadRequestResponse({
    description: 'Something happended while trying to update the user',
  })
  @ApiUnauthorizedResponse({
    description: 'either no token or the token expired',
  })
  @ApiInternalServerErrorResponse({ description: 'Error from the server' })
  async updateUserPassword(
    @Res() res: Response,
    @Req() req: Request,
    @Param() param: any,
    @Body() body: PasswordUpdatePayload,
  ) {
    const user = req['user'];
    const result = await this.userService.updatePassword(user, body);
    res.status(result.statusCode).send(result);
  }

  // DELETE ROUTE

  @Delete('deletepaydayloan/:loan_id')
  @ApiTags('USER')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiParam({ name: 'loan_id', type: String })
  @ApiOkResponse({ description: 'paydayloan deleted' })
  @ApiBadRequestResponse({
    description: 'Something happended while trying to delete the loan',
  })
  @ApiUnauthorizedResponse({
    description: 'either no token or the token expired',
  })
  @ApiInternalServerErrorResponse({ description: 'Error from the server' })
  async deletePaydayLoan(@Res() res: Response, @Param() param: any) {
    const result = await this.PaydayLoanService.deleteLoan(param['loan_id']);
    res.status(result.statusCode).send(result);
  }

  @Delete('deleteSMEloan/:loan_id')
  @ApiTags('USER')
  @ApiHeaders([
    {
      name: 'Authorization',
      example: 'Bearer token',
      description: 'This is a bearer token',
    },
  ])
  @ApiParam({ name: 'loan_id', type: String })
  @ApiOkResponse({ description: 'paydayloan deleted' })
  @ApiBadRequestResponse({
    description: 'Something happended while trying to delete the loan',
  })
  @ApiUnauthorizedResponse({
    description: 'either no token or the token expired',
  })
  @ApiInternalServerErrorResponse({ description: 'Error from the server' })
  async deleteSMELoan(@Res() res: Response, @Param() param: any) {
    const result = await this.SMEloanService.deleteLoan(param['loan_id']);
    res.status(result.statusCode).send(result);
  }
}
