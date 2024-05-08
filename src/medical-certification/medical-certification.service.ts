import { BadRequestException, Injectable, Put } from "@nestjs/common";
import { Status } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { MedicalCertificationDto } from "./dto";
import { readFileSync } from "fs";


@Injectable()
export class MedicalCertificationService {
  constructor(private readonly prisma: PrismaService) { }

  async getUsersMedicalCertifications(userId: number, status: Status) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId
        }
      });

      if (!user) throw new BadRequestException('User not found');

      const filter: Record<string, any> = {
        userId
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

  async resolveMedicalCertification(id: number, newStatus: Status) {
    try {
      if (!(newStatus in Status)) throw new BadRequestException('Invalid status');

      return await this.prisma.medicalCertificate.update({
        where: {
          id
        },
        data: {
          status: newStatus
        }
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async createMedicalCertification(data: MedicalCertificationDto, path: string) {
    try {
      const { userId, description } = data;
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId
        }
      });

      if (!user) throw new BadRequestException('User not found');

      return await this.prisma.medicalCertificate.create({
        data: {
          userId,
          description,
          path
        }
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}