import { Module } from "@nestjs/common";
import { TeacherController } from "./teacher.controller";
import { TeacherService } from "./teacher.service";
import { PrismaService } from "nestjs-prisma";

@Module({
  controllers: [TeacherController],
  providers: [TeacherService, PrismaService]
})
export class TeacherModule { }