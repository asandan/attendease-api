import { Injectable } from "@nestjs/common";
import { Teacher } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { CRUDService } from "src/common/CRUDService";

@Injectable()
export class TeacherService extends CRUDService<Teacher> {
  constructor(protected readonly prismaService: PrismaService) {
    super('teacher');
  }
}