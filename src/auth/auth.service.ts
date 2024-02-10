import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { ROLES } from '@prisma/client';

@Injectable({})
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signUpStudent(dto: AuthDTO) {
    const { password: _password } = dto;
    const password = bcrypt.hashSync(_password, 10);

    // return this.prismaService.user.create({
    //   data: {
    //     ...dto,
    //     password,
    //   },
    // });
  }
}
