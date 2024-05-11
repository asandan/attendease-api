import { Module } from "@nestjs/common";
import { SubjectController } from "./subject.controller";
import { SubjectService } from "./subject.service";
import { PrismaService } from "nestjs-prisma";

@Module({
  controllers: [SubjectController],
  providers: [SubjectService, PrismaService]
})
export class SubjectModule { }