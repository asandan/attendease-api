import { ForbiddenException } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
export async function setupCors(app: NestExpressApplication): Promise<void> {
  const whitelist = ['http://localhost:3000', 'https://myheat.link/'];

  app.enableCors({
    origin(origin, callback) {
      if (!origin || whitelist.find((el) => el === origin)) {
        callback(null, true);
      } else {
        throw new ForbiddenException();
      }
    },
    methods: 'GET,HEAD,PUT,OPTIONS,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    // credentials: true,
  });
}