import { Module } from "@nestjs/common";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";
import { PrismaService } from "nestjs-prisma";

@Module({
  controllers: [StudentController],
  providers: [StudentService, PrismaService]
})
export class StudentModule { }