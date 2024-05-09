import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { MedicalCertificationService } from "./medical-certification.service";
import { Status } from "@prisma/client";
import { MedicalCertificationDto } from "./dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from "path";


@Controller("medical-certification")
export class MedicalCertificationController {
  constructor(private readonly medicalCertificationService: MedicalCertificationService) { }
 
  @Get("/:userId")
  async getUsersMedicalCertifications(@Param("userId", ParseIntPipe) userId: number, @Query("status") status: Status) {
    try {
      return await this.medicalCertificationService.getUsersMedicalCertifications(userId, status);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Put("/:id")
  async resolveMedicalCertification(@Param("id", ParseIntPipe) id: number, @Query("status") newStatus: Status) {
    try {
      return await this.medicalCertificationService.resolveMedicalCertification(id, newStatus);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './storage/medical-certifications/',
      filename: (_, file, callback) => {
        const randomName = uuidv4();
        return callback(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async createMedicalCertification(@UploadedFile() image: Express.Multer.File, @Body(ValidationPipe) dto: MedicalCertificationDto) {
    try {
      return await this.medicalCertificationService.createMedicalCertification(dto, image.path);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}