import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
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
import { Response } from 'express';
import { User } from 'src/Schema/User.entity';
import { UserService } from './services/user/user.service';

class ChangePassword {
  @ApiProperty({
    type: String,
  })
  newpassword: string;

  @ApiProperty({
    type: String,
  })
  oldpassword: string;
}

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  // GET
  @ApiBody({ type: User })
  @ApiTags('AUTH')
  @Get('verify/:code')
  @ApiBody({ type: User })
  @ApiOkResponse({ description: 'Account created' })
  @ApiBadRequestResponse({
    description: 'There was an error, check the return body',
  })
  @ApiInternalServerErrorResponse({
    description: 'Interal server error, contact the dev!',
  })
  async verify(@Res() res: Response, @Param() param: any) {
    const result = await this.userService.verifyUser(param['code']);
    if (result.statusCode === 200) {
      res.redirect('https://app.eazicred.com/login');
    }
    res.status(result.statusCode).send(result);
  }

  // POST ROUTES

  @ApiBody({ type: User })
  @ApiTags('AUTH')
  @Post('register')
  @ApiBody({ type: User })
  @ApiOkResponse({ description: 'Account created' })
  @ApiBadRequestResponse({
    description: 'There was an error, check the return body',
  })
  @ApiInternalServerErrorResponse({
    description: 'Interal server error, contact the dev!',
  })
  async register(@Res() res: Response, @Body() body: User) {
    const result = await this.userService.createAccount(body);
    res.status(result.statusCode).send(result);
  }

  @ApiBody({ type: User })
  @ApiTags('AUTH')
  @Post('login')
  @ApiBody({ type: User })
  @ApiOkResponse({ description: 'Account created' })
  @ApiBadRequestResponse({
    description: 'There was an error, check the return body',
  })
  @ApiInternalServerErrorResponse({
    description: 'Interal server error, contact the dev!',
  })
  async login(@Res() res: Response, @Body() body: Partial<User>) {
    const result = await this.userService.loginUser(body);
    res.status(result.statusCode).send(result);
  }

  // PUT Routes

  @ApiBody({ type: User })
  @ApiTags('AUTH')
  @Post('changepassword/:user_id')
  @ApiParam({ name: 'user_id', type: String })
  @ApiBody({ type: ChangePassword })
  @ApiOkResponse({ description: 'password updated successfully' })
  @ApiBadRequestResponse({
    description: 'There was an error, check the return body',
  })
  @ApiInternalServerErrorResponse({
    description: 'Interal server error, contact the dev!',
  })
  async resetpassword(
    @Res() res: Response,
    @Param() param: any,
    @Body() body: ChangePassword,
  ) {
    const result = await this.userService.changePassword(
      param['user_id'],
      body,
    );
    res.status(result.statusCode).send(result);
  }
}
