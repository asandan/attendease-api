import { Test, TestingModule } from '@nestjs/testing';
import { MedicalCertificationService } from '../../src/medical-certification/medical-certification.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { Status } from '@prisma/client';
import { MedicalCertificationDto } from '../../src/medical-certification/dto';
import { Account, ROLE } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { MedicalCertificationController } from '../../src/medical-certification/medical-certification.controller';
import * as fs from 'fs';

describe('MedicalCertificationService', () => {

  let service: MedicalCertificationService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [PrismaModule],
controllers: [MedicalCertificationController],
      providers: [MedicalCertificationService, PrismaService, ConfigService],
    }).compile();

    jest.mock('fs');

    service = module.get<MedicalCertificationService>(MedicalCertificationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getUsersMedicalCertifications', () => {
    it('should return user medical certifications', async () => {
        const studentId = 1;
        const account = {
            id: 1,
             email: 'example@example.com', 
             password: 'password', 
             name: 'John', 
             surname: 'Doe', 
             role: ROLE.STUDENT, 
             createdAt: new Date(), 
             updatedAt: new Date() 
        }
        const status = Status.PENDING;
        const certifications = [
          {
            id: 1,
            studentId,
            description: 'Certification 1',
            path: '/path/to/certification1.png',
            status: Status.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
            originalName: 'file.png'
          },
          {
            id: 2,
            studentId,
            description: 'Certification 2',
            path: '/path/to/certification2.png',
            status: Status.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
            originalName: 'file.png'
          },
        ];
        jest.spyOn(prismaService.account, 'findUnique').mockResolvedValue(account);
        jest.spyOn(prismaService.medicalCertificate, 'findMany').mockResolvedValue(certifications);
        jest.spyOn(fs, 'readFileSync').mockReturnValue('Base64EncodedImage');
  
        const result = await service.getUsersMedicalCertifications(studentId, status);
        expect(result).toHaveLength(certifications.length);
        expect(result[0].picture).toBeDefined();
        expect(result[0].extension).toBeDefined();
      });
  
      it('should throw BadRequestException if user not found', async () => {
        const studentId = 1;
        const status = Status.APPROVED;

        jest.spyOn(prismaService.account, 'findUnique').mockResolvedValueOnce(null);

        try {
          await service.getUsersMedicalCertifications(studentId, status);
      } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toBe('User not found');
      }
    });
    
    
  });

  describe('createMedicalCertification', () => {
    it('should create medical certification', async () => {
      const data: MedicalCertificationDto = { userId: 1, description: 'Test Certification' };
      const path = '/path/to/certification.png';
      const originalName = 'certification.png';

      jest.spyOn(prismaService.student, 'findUnique').mockResolvedValue({ id: 1, accountId: 1, groupId: 1 });
      jest.spyOn(prismaService.medicalCertificate, 'create').mockResolvedValue({ id: 1, path: path, status: 'PENDING', originalName: originalName, description: data.description, studentId: 1, createdAt: new Date(), updatedAt: new Date() });

      const result = await service.createMedicalCertification(data, path, originalName);

      expect(result).toHaveProperty('id');
      expect(result.studentId).toEqual(data.userId);
      expect(result.description).toEqual(data.description);
    });

    it('should throw BadRequestException if user not found', async () => {
      const data: MedicalCertificationDto = { userId: 1, description: 'Test Certification' };
      const path = '/path/to/certification.png';
      const originalName = 'certification.png';

      jest.spyOn(prismaService.student, 'findUnique').mockResolvedValue(null);

      await expect(service.createMedicalCertification(data, path, originalName)).rejects.toThrow(BadRequestException);
    });
  });
});
