import { Controller, Get, Param, Res, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { EmailService } from 'src/globalservices/email/email.service';
import { UserNotiService } from './services/user/user.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private emailService: EmailService,
    private notiService: UserNotiService,
  ) {}

  @Get('admin')
  @ApiTags('Notifications')
  @ApiOkResponse({ description: 'Notifications returned ' })
  @ApiBadRequestResponse({ description: 'There was an error' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async noti(@Res() res: Response) {
    const result = await this.notiService.getAdminNot();
    res.status(result.statusCode).send(result);
  }

  @Get('user/:user_id')
  @ApiTags('Notifications')
  @ApiOkResponse({ description: 'Notifications returned ' })
  @ApiBadRequestResponse({ description: 'There was an error' })
  @ApiParam({ type: String, description: 'the user id', name: 'user_id' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async notiuser(@Res() res: Response, @Param() param: any) {
    const result = await this.notiService.getUserNot(param['user_id']);
    res.status(result.statusCode).send(result);
  }

  // POST ROUTE
  @Post('read/:id')
  @ApiTags('Notifications')
  @ApiOkResponse({ description: 'Notifications returned ' })
  @ApiBadRequestResponse({ description: 'There was an error' })
  @ApiParam({ type: String, description: 'id', name: 'id' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async read(@Res() res: Response, @Param() param: any) {
    const result = await this.notiService.markasRead(param['id']);
    res.status(result.statusCode).send(result);
  }

  // DELETE
  @Post(':id')
  @ApiTags('Notifications')
  @ApiOkResponse({ description: 'Notifications returned ' })
  @ApiBadRequestResponse({ description: 'There was an error' })
  @ApiParam({ type: String, description: 'id', name: 'id' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async del(@Res() res: Response, @Param() param: any) {
    const result = await this.notiService.markasRead(param['id']);
    res.status(result.statusCode).send(result);
  }
}
