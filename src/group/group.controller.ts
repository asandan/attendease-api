import { BadRequestException, Controller, Get, Query, Res } from "@nestjs/common";
import { GroupQuery } from "./dto";
import { Group } from "@prisma/client";
import { Response } from "express";
import { GroupService } from "./group.service";


@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) { }

  @Get()
  async findAll(
    @Query() query: GroupQuery,
    @Res() res: Response,
  ): Promise<Response<Group[]>> {
    try {
      const { skip, take, sort, teacherId } = query;
      return res.json(
        await this.groupService.findAll({
          skip,
          take,
          sort,
          where: {
            teacherId
          }
        }),
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}