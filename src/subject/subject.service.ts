import { Injectable } from "@nestjs/common";
import { Subject } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { CRUDService } from "src/common/CRUDService";

@Injectable()
export class SubjectService extends CRUDService<Subject> {
  constructor(protected readonly prismaService: PrismaService) {
    super('subject');
  }
}