import { BadRequestException, Controller, Get, Query, Res } from "@nestjs/common";
import { StudentQuery } from "./dto";
import { Student } from "@prisma/client";
import { Response } from "express";
import { StudentService } from "./student.service";


@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @Get()
  async findAll(
    @Query() query: StudentQuery,
    @Res() res: Response,
  ): Promise<Response<Student[]>> {
    try {
      const { skip, take, sort, ...where } = query;
      return res.json(
        await this.studentService.findAll({
          skip,
          take,
          sort,
          where,
          include: {
            group: true,
            account: true,
          }
        }),
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}