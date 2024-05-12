import { BadRequestException, Controller, Get, Query, Res } from "@nestjs/common";
import { TeacherQuery } from "./dto";
import { Teacher } from "@prisma/client";
import { Response } from "express";
import { TeacherService } from "./teacher.service";


@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) { }

  @Get()
  async findAll(
    @Query() query: TeacherQuery,
    @Res() res: Response,
  ): Promise<Response<Teacher[]>> {
    try {
      const { skip, take, sort, ...where } = query;
      return res.json(
        await this.teacherService.findAll({
          skip,
          take,
          sort,
          where,
          include: {
            account: true,
            subject: true,            
          }
        }),
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}