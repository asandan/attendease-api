import { BadRequestException, Controller, Get, Query, Res } from "@nestjs/common";
import { SubjectQuery } from "./dto";
import { Subject } from "@prisma/client";
import { Response } from "express";
import { SubjectService } from "./subject.service";


@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) { }

  @Get()
  async findAll(
    @Query() query: SubjectQuery,
    @Res() res: Response,
  ): Promise<Response<Subject[]>> {
    try {
      const { skip, take, sort, ...where } = query;
      return res.json(
        await this.subjectService.findAll({
          skip,
          take,
          sort,
          where,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}