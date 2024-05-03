import { AuthService } from './../src/auth/auth.service';
import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('create a new user and chek correctly or not', async () => {

      const dto = {
        id: 1,
        email: 'user@example.com',
        password: 'password',
        name: 'John',
        surname: 'Doe',
        roleId: 1, 
        groupId: 1
      };

      jest.spyOn(service['prisma'].user, 'create').mockResolvedValue(dto);

      // When
      const result = await service.signup(dto);

      // Then
      expect(result).toEqual({ id: 1, email: 'user@example.com' });
      expect(service['prisma'].user.create).toHaveBeenCalled();
    });

    it('should throw a ForbiddenException if the user already exists', async () => {
      const dto = {
        id: 1,
        email: 'user@example.com',
        password: 'password',
        name: 'John',
        surname: 'Doe',
        roleId: 1, 
        groupId: 1
      };

      jest.spyOn(service['prisma'].user, 'create').mockRejectedValue(new Error('User already exists'));

      // When, Then
      await expect(service.signup(dto)).rejects.toThrowError(ForbiddenException);
    });

    it('should throw a ForbiddenException if the user does not exist', async () => {
      const dto = {
        id: 1,
        email: 'user@example.com',
        password: 'password',
        name: 'John',
        surname: 'Doe',
        roleId: 1, 
        groupId: 1
      };

      jest.spyOn(service['prisma'].user, 'findUnique').mockResolvedValue(null);

      // When, Then
      await expect(service.signin(dto)).rejects.toThrowError(
        new ForbiddenException("User doesn't exist"),
      );
    });
  });
});
