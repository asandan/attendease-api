import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { Session } from 'express-session';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) { }

  use(req: Request & { session: Partial<Session> }, _: Response, next: NextFunction): void {
    const authorization = req.headers['authorization'];
    const cookies = cookie.parse(req.headers.cookie || '');

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

    try {
      const decodedToken = jwt.verify(
        cookies['next-auth.session-token'].trim(),
        this.configService.get('JWT_KEY'),
        {
          algorithms: ['HS512'],
        },
      );
      req.session = { ...req.session, user: decodedToken } as any;
      return next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private validateCredentials(username: string, password: string): boolean {
    return username === process.env.BASIC_AUTH_USER && password === process.env.BASIC_AUTH_PASS;
  }
}
