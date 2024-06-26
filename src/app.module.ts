import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AttendanceSnapshotModule } from "./attendance-snapshot/attendance-snapshot.module";
import { MedicalCertificationModule } from "./medical-certification/medical-certification.module";
import { SubjectModule } from "./subject/subject.module";
import { GroupModule } from "./group/group.module";
import { StudentModule } from "./student/Student.module";
import { TeacherModule } from "./teacher/teacher.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AttendanceSnapshotModule,
    MedicalCertificationModule,
    SubjectModule,
    GroupModule,
    StudentModule,
    TeacherModule,
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
