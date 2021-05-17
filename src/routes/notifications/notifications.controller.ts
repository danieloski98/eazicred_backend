import { Controller, Get, Param, Res } from '@nestjs/common';
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
}
