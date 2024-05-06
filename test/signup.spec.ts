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
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, ConfigModule],
      controllers: [AuthController],
      providers: [AuthService, PrismaService, ConfigService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('signup', () => {
    it('should successfully create a new user', async () => {
      const dto: AuthDto = {
        email: 'test@email.com',
        password: 'password',
        name: 'John',
        surname: 'Doe',
        roleId: 1,
        groupId: 1,
      };

      const mockedHashedPassword = await bcrypt.hash(dto.password, 10);

      const mockedCreatedUser = {
        ...dto,
        password: mockedHashedPassword, // Include the hashed password in the created user object
        id: 1, // Mocked user ID
      };

      jest.spyOn(authService, 'signup').mockResolvedValueOnce(mockedCreatedUser);

      const result = await controller.signup(dto);

      expect(result).toEqual(mockedCreatedUser);

    });

    it('should throw a ForbiddenException if the user already exists', async () => {
      const dto: AuthDto = {
        email: 'test@email.com',
        password: 'password',
        name: 'John',
        surname: 'Doe',
        roleId: 1,
        groupId: 1,
      };
    
      const hashedPassword = await bcrypt.hash(dto.password, 10);
    
      const existingUser = {
        ...dto,
        password: hashedPassword,
        id: 1,
      };
    
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(existingUser);
    
      await expect(authService.signup(dto)).rejects.toThrowError("User already exists");
    });
    });
      describe('signin', () => {
        it("should throw a ForbiddenException if the user doesn't exist", async () => {
          const dto: AuthDto = {
            email: 'test1@email.com',
            password: 'password',
            name: 'John',
            surname: 'Doe',
            roleId: 1,
            groupId: 1
          };
        
          // Attempt to sign in with the non-existent user
          await expect(authService.signin(dto)).rejects.toThrowError("ForbiddenException: User doesn't exist");
        });
        it("should throw a ForbiddenException if the invalid credentials", async () => {
          const dto: AuthDto = {
            email: 'test@email.com',
            password: 'password123',
            name: 'John',
            surname: 'Doe',
            roleId: 1,
            groupId: 1
          };
        
          // Attempt to sign in with the non-existent user
          await expect(authService.signin(dto)).rejects.toThrowError("ForbiddenException: Invalid credentials");
        });
    });
});
