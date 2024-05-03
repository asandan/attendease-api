import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService], 
    }).compile();
  
    service = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
   it('will create a user', async() =>{
    const dto = {
      id: 1,
      email: 'user@example.com',
      password: 'password',
      name: 'John',
      surname: 'Doe',
      roleId: 1, 
      groupId: 1
    }
    jest.spyOn(service['prisma'].user, 'create').mockResolvedValue(dto);
    
    const result = await service.signup(dto);
        expect(result.email).toEqual(dto.email);
        expect(result.id).toEqual(dto.id);
        expect(result.name).toEqual(dto.name);
        expect(result.surname).toEqual(dto.surname);
        expect(result.roleId).toEqual(dto.roleId);
        expect(result.groupId).toEqual(dto.groupId);
   });

it(' will check if user is already exist', async ()=> {
  const dto = {
    id: 1,
    email: 'user@example.com',
    password: 'password',
    name: 'John',
    surname: 'Doe',
    roleId: 1, 
    groupId: 1
  }
  jest.spyOn(service['prisma'].user, 'findUnique').mockResolvedValue(dto);
  const result = await service.signup(dto);
  expect(result.email).toEqual(dto.email);
});
});
});
