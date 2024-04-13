import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction): void {
    const authorization = req.headers['authorization'];

    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [type, credentials] = authorization.split(' ');

    if (type !== 'Basic' || !credentials) {
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    const [username, password] = Buffer.from(credentials, 'base64').toString().split(':');

    if (!this.validateCredentials(username, password)) {
      throw new UnauthorizedException('Invalid username or password');
    }

    next();
  }

  private validateCredentials(username: string, password: string): boolean {
    return username === process.env.BASIC_AUTH_USER && password === process.env.BASIC_AUTH_PASS;
  }
}
