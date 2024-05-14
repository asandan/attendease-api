import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const cookies = cookie.parse(request.headers.cookie || '');

    if (!cookies['next-auth.session-token']) {
      throw new UnauthorizedException();
    }

    try {
      jwt.verify(
        cookies['next-auth.session-token'].trim(),
        this.configService.get('JWT_KEY'),
        {
          algorithms: ['HS512'],
        },
      );
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}