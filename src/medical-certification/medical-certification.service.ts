import { BadRequestException, Injectable, Put } from "@nestjs/common";
import { Status } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { MedicalCertificationDto, ResolveManyDto } from "./dto";
import { readFileSync } from "fs";



@Injectable()
export class MedicalCertificationService {
  constructor(private readonly prisma: PrismaService) { }

  async getUsersMedicalCertifications(studentId: number, status: Status) {
    try {
      const user = await this.prisma.student.findUnique({
        where: {
          id: studentId
        }
      });

      if (!user) {
        console.log('User not found, throwing BadRequestException');
        throw new BadRequestException('User not found')};

      const filter: Record<string, any> = {
        studentId
      };

      if (status) {
        filter.status = status;
      }
      return (await this.prisma.medicalCertificate.findMany({
        where: {
          ...filter
        }
      })).map(certification => {
        return {
          ...certification,
          picture: readFileSync(certification.path, 'base64'),
          extension: certification.path.split('.').pop()
        }
      })
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async resolveMany(data: ResolveManyDto[]) {
    try {
      if (!(data.some((el) => el.status in Status))) throw new BadRequestException('Invalid status');

      return await Promise.all(data.map(async ({ id, status }) => await this.prisma.medicalCertificate.update({
        where: {
          id
        },
        data: {
          status
        }
      })
      ))
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async createMedicalCertification(data: MedicalCertificationDto, path: string, originalName: string) {
    try {
      const { userId, description } = data;
      const user = await this.prisma.student.findUnique({
        where: {
          id: userId
        }
      });

      if (!user) throw new BadRequestException('User not found');

      return await this.prisma.medicalCertificate.create({
        data: {
          studentId: userId,
          description,
          path,
          originalName,
        }
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}