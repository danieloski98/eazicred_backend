import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import * as morgan from 'morgan';

async function bootstrap() {
  const port = 3000;
  const logger = new Logger();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.use(morgan('combined'));

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  const config = new DocumentBuilder()
    .setTitle('EAZICRED')
    .setDescription('The EaziCred API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  logger.debug(`Server Started on Port ${port}`);
  await app.listen(port);
}
bootstrap();
