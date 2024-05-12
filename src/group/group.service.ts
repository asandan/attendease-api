import { Injectable } from "@nestjs/common";
import { Group } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { CRUDService } from "src/common/CRUDService";

@Injectable()
export class GroupService extends CRUDService<Group> {
  constructor(protected readonly prismaService: PrismaService) {
    super('group');
  }
}