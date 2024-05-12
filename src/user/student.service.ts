import { Injectable } from "@nestjs/common";
import { Student } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { CRUDService } from "src/common/CRUDService";

@Injectable()
export class StudentService extends CRUDService<Student> {
  constructor(protected readonly prismaService: PrismaService) {
    super('student');
  }
}