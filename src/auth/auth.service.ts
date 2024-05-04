import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) { }

  async signup(dto: AuthDto) {
    try {
      const {
        email,
        password: _password,
        name,
        surname,
        roleId,
        groupId
      } = dto;

      const password = await bcrypt.hash(_password, 10);

      const payload = {
        email,
        password,
        name,
        surname,
        roleId,
      } as User;

      if (groupId) {
        payload.groupId = groupId;
      }

      try {
        return await this.prisma.user.create({
          data: payload,
        });
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === 'P2002') {
            throw new ForbiddenException('User already exists');
          }
        }
        throw new BadRequestException(e);
      }
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async signin(dto: AuthDto) {
    try {
      const { email, password } = dto;

      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new ForbiddenException("User doesn't exist");
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        throw new ForbiddenException('Invalid credentials');
      }

      return user;
    } catch (e) {
      throw new Error(e);
    }
  }
}
