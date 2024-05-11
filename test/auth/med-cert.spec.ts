import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { MedicalCertificationService } from '../../src/medical-certification/medical-certification.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Status } from '@prisma/client';
import { MedicalCertificationDto } from '../../src/medical-certification/dto/medical-certification.dto';
import { readFileSync } from 'fs';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MedicalCertificationController } from '../../src/medical-certification/medical-certification.controller';
import { MedicalCertificationModule } from '../../src/medical-certification/medical-certification.module';
import * as fs from 'fs';

describe('MedicalCertificationService', () => {
  let service: MedicalCertificationService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, ConfigModule],
      controllers: [MedicalCertificationController],
      providers: [MedicalCertificationService, PrismaService, ConfigService],
    }).compile();
    service = module.get<MedicalCertificationService>(MedicalCertificationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });



  describe('getUsersMedicalCertifications', () => {
    it('should return user medical certifications', async () => {
      const userId = 1;
      const status = Status.PENDING;
      const certifications = [{ 
        id: 1, 
        path: '/path/to/certification.png',
        status: Status.PENDING, // Add status property
        description: 'Certification description', // Add description property
        userId: 1, // Add userId property
        createdAt: new Date(), // Add createdAt property
        updatedAt: new Date() // Add updatedAt property
      }];
      
      
      
      jest.spyOn(fs, 'readFileSync').mockReturnValue('Base64EncodedImage');

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({ 
        id: userId, 
        email: 'test@example.com', 
        password: 'password', 
        name: 'John', 
        surname: 'Doe',
        roleId: 1,
        groupId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      jest.spyOn(prismaService.medicalCertificate, 'findMany').mockResolvedValue(certifications);
      const result = await service.getUsersMedicalCertifications(userId, status);
      expect(result).toHaveLength(certifications.length);
      expect(result[0].picture).toBeDefined();
      expect(result[0].extension).toBeDefined();
    });

    it('should throw BadRequestException if user not found', async () => {
      const userId = 1;
      const status = Status.PENDING;
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      await expect(service.getUsersMedicalCertifications(userId, status)).rejects.toThrow(BadRequestException);
    });

    // Add more test cases for other scenarios
  });

  describe('createMedicalCertification', () => {
    it('should create medical certification', async () => {
      const data: MedicalCertificationDto = { userId: 1, description: 'Test Certification' };
      const path = '/path/to/certification.png';
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({ 
        id: 1, 
        email: 'test@example.com', 
        password: 'password', 
        name: 'John', 
        surname: 'Doe',
        roleId: 1,
        groupId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const certificationData = {
        id: 1, // You can omit id as it will be generated by the database
        path: '/path/to/certification.png',
        status: Status.PENDING, // Set default status
        description: 'Test Certification',
        userId: 1,
        createdAt: new Date(), // Set createdAt
        updatedAt: new Date() // Set updatedAt
      };
      jest.spyOn(prismaService.medicalCertificate, 'create').mockResolvedValue(certificationData);
      
      const result = await service.createMedicalCertification(data, path);
      expect(result.userId).toEqual(data.userId);
      expect(result.description).toEqual(data.description);
      expect(result.path).toEqual(path);
    });

    it('should throw BadRequestException if user not found', async () => {
      const data: MedicalCertificationDto = { userId: 1, description: 'Test Certification' };
      const path = '/path/to/certification.png';
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      await expect(service.createMedicalCertification(data, path)).rejects.toThrow(BadRequestException);
    });
  });

  describe('resolveMedicalCertification', () => {
    it('should resolve medical certification status', async () => {
      const id = 1;
      const newStatus = Status.APPROVED;
      const certification = {
        id: 1,
        path: '/path/to/certification.png',
        status: Status.PENDING,
        description: 'Test Certification',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(prismaService.medicalCertificate, 'update').mockResolvedValue(certification);
      const result = await service.resolveMedicalCertification(id, newStatus);
      expect(result.id).toEqual(id);
      expect(result.status).toEqual(newStatus);
    });

    it('should throw BadRequestException if invalid status', async () => {
      const id = 1;
      const newStatus = 'INVALID_STATUS' as Status;
      await expect(service.resolveMedicalCertification(id, newStatus)).rejects.toThrow(BadRequestException);
    });

    
  });
});