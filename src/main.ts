import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const port = process.env.PORT || 4001;
const globalPrefix = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(globalPrefix);
  app.enableCors()
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
bootstrap();
