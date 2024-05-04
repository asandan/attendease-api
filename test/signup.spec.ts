import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';
import * as bcrypt from 'bcrypt';
import { AuthController } from '../src/auth/auth.controller';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { PrismaModule } from '../src/prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, ConfigModule],
      controllers: [AuthController],
      providers: [AuthService, PrismaService, ConfigService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('should successfully create a new user', async () => {
      const mockedData: AuthDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'John',
        surname: 'Doe',
        roleId: 1,
        groupId: 1,
      };

      const mockedHashedPassword = await bcrypt.hash(mockedData.password, 10);

      const mockedCreatedUser = {
        ...mockedData,
        password: mockedHashedPassword, // Include the hashed password in the created user object
        id: 1, // Mocked user ID
      };

      jest
        .spyOn(authService, 'signup')
        .mockResolvedValueOnce(mockedCreatedUser);

      const result = await controller.signup(mockedData);

      expect(result).toEqual(mockedCreatedUser);
    });
  });
});
