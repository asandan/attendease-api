import { Module } from "@nestjs/common";
import { MedicalCertificationController } from "./medical-certification.controller";
import { MedicalCertificationService } from "./medical-certification.service";

@Module({
  controllers: [MedicalCertificationController],
  providers: [MedicalCertificationService],
})
export class MedicalCertificationModule { }