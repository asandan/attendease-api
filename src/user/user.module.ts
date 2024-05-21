import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PrismaService } from "nestjs-prisma";

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService]
})
export class UserModule { }