import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({ credentials: true, origin: 'http://localhost:3000' });
  app.setGlobalPrefix('api');

  await app.listen(7777);
}

bootstrap();
