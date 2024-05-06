import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AttendanceSnapshotModule } from "./attendance-snapshot/attendance-snapshot.module";
import { MedicalCertificationModule } from "./medical-certification/medical-certification.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AttendanceSnapshotModule,
    MedicalCertificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
