import { RemoveDefaultFields } from './../util/types/utilTypes';
import * as bcrypt from 'bcrypt';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Account, ROLE } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) { }

  async signup(dto: AuthDto) {
    try {
      const {
        password: _password,
        role,
        groupId,
        subjectId,
        ...restDto
      } = dto;

      const password = await bcrypt.hash(_password, 10);

      const payload: RemoveDefaultFields<Account> = {
        password,
        role,
        ...restDto
      };

      try {
        const account = await this.prisma.account.create({
          data: payload,
        });

        if (role === ROLE.STUDENT) {
          return await this.prisma.student.create({
            data: {
              accountId: account.id,
              groupId,
            }
          })
        }

        if (role === ROLE.TEACHER) {
          return await this.prisma.teacher.create({
            data: {
              accountId: account.id,
              subjectId,
            }
          })
        }

        return await this.prisma.admin.create({
          data: {
            accountId: account.id,
          }
        })

      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === 'P2002') {
            throw new ForbiddenException('User already exists, unique constraint failed');
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

      const { role, id: accountId, ...account } = await this.prisma.account.findUnique({
        where: {
          email,
        },
      });

      const user = await this.prisma[role.toLowerCase()].findUnique({
        where: {
          accountId,
        },

      })

      if (!user) {
        throw new ForbiddenException("User doesn't exist");
      }

      const match = await bcrypt.compare(password, account.password);

      if (!match) {
        throw new ForbiddenException('Invalid credentials');
      }

      delete account.password;
      delete account.createdAt;
      delete account.updatedAt;
      delete user.accountId;

      return { ...user, ...account, role };
    } catch (e) {
      throw new Error(e);
    }
  }
}
