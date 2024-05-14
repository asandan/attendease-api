import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import * as bcrypt from 'bcrypt';
import { AuthController } from '../../src/auth/auth.controller';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AuthDto } from '../../src/auth/dto';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { Account, PrismaClient, ROLE } from '@prisma/client';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';



describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [AuthController],
      providers: [AuthService, PrismaService, ConfigService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('signup', () => {
    it('should successfully create a new Student user', async () => {
      const dto: AuthDto = {
        email: 'student_test@email.com',
        password: 'password',
        name: 'John',
        surname: 'Doe',
        role: ROLE.STUDENT, 
        groupId: 1,
        subjectId: 1
      };

      const mockedCreatedUser = {
        ...dto,
        id: 1,
        accountId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(authService, 'signup').mockResolvedValueOnce(mockedCreatedUser);

      const result = await controller.signup(dto);

      expect(result).toEqual(mockedCreatedUser);
    });
    it('should successfully create a new Teacher user', async () => {
      const dto: AuthDto = {
        email: 'teacher_test@email.com',
        password: 'password',
        name: 'John',
        surname: 'Doe',
        role: ROLE.TEACHER, 
        groupId: 1,
        subjectId: 1
      };

      const mockedCreatedUser = {
        ...dto,
        id: 1,
        accountId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(authService, 'signup').mockResolvedValueOnce(mockedCreatedUser);

      const result = await controller.signup(dto);

      expect(result).toEqual(mockedCreatedUser);
    });

    it('should successfully create a new Admin user', async () => {
      const dto: AuthDto = {
        email: 'admin_test@email.com',
        password: 'password',
        name: 'John',
        surname: 'Doe',
        role: ROLE.ADMIN, 
        groupId: 1,
        subjectId: 1
      };

      const mockedCreatedUser = {
        ...dto,
        id: 1,
        accountId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
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
        role: ROLE.STUDENT,
        groupId: 1,
        subjectId: 1
      };
    
      jest.spyOn(prismaService.account, 'findUnique').mockResolvedValueOnce({ email: dto.email } as Account);
    
      await expect(authService.signup(dto)).rejects.toThrowError("User already exists, unique constraint failed");
    });
    
    
  });

  describe('signin', () => {
    /*it("should throw a ForbiddenException if the user doesn't exist", async () => {
      const dto: AuthDto = {
        email: 'nonexistent@email.com',
        password: 'password',
        name: 'John', 
        surname: 'Doe',
        role: ROLE.STUDENT,
        groupId: 1,
        subjectId: 1
      };
      const id = 1;

      jest.spyOn(prismaService.account, 'findUnique').mockResolvedValueOnce({ id } as Account);

      await expect(authService.signin(dto)).rejects.toThrowError(ForbiddenException);
    });
  

    it("should throw a ForbiddenException if the invalid credentials", async () => {
      const dto: AuthDto = {
        email: 'existing@email.com',
        password: 'wrongpassword',
        name: 'John', 
        surname: 'Doe',
        role: ROLE.STUDENT,
        groupId: 1,
        subjectId: 1
      };

      const existingUser = {
        email: dto.email,
        password: await bcrypt.hash('correctpassword', 10),
      };

      jest.spyOn(prismaService.account, 'findUnique').mockResolvedValueOnce(existingUser as Account);

      await expect(authService.signin(dto)).rejects.toThrowError(ForbiddenException);
    });*/

  });
});
