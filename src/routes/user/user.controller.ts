import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { SMELOAN } from 'src/Schema/SME.entity';
import { SmeloansService } from './services/smeloans/smeloans.service';
import { UserService } from './services/user/user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private SMEloanService: SmeloansService,
  ) {}

  // GET ROUTES

  @Get(':id')
  @ApiTags('USER')
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

  // POST ROUTES

  @Post('createSMEloan')
  @ApiTags('USER')
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
}
