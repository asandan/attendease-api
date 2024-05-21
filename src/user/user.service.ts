import { BadRequestException, Injectable } from "@nestjs/common";
import { Teacher } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { CRUDService } from "src/common/CRUDService";
import { GetUserProfileDto } from "./dto";

@Injectable()
export class UserService {
  constructor(protected readonly prismaService: PrismaService) { }

  async getUserProfile(data: GetUserProfileDto) {
    try {
      const { id, role } = data;

      if (role === 'TEACHER') {
        const teacher = await this.prismaService.teacher.findUnique({
          where: {
            id
          },
          include: {
            account: {
              select: {
                email: true,
                name: true,
                surname: true,
              }
            },
            subject: {
              select: {
                name: true,
              }
            },
          }
        })
        return {
          ...teacher.account,
          subject: teacher.subject.name,
        }
      } else if (role === 'STUDENT') {
        const student = await this.prismaService.student.findUnique({
          where: {
            id
          },
          select: {
            account: {
              select: {
                email: true,
                name: true,
                surname: true,
              }
            },
            group: {
              select: {
                ep: {
                  select: {
                    faculty: {
                      select: {
                        name: true
                      }
                    },
                    name: true,
                  },

                },
                name: true,
              },
            }
          }
        })

        return {
          ...student.account,
          group: student.group.name,
          faculty: student.group.ep.faculty.name,
          ep: student.group.ep.name
        }
      }

      const { account } = await this.prismaService.admin.findUnique({
        where: {
          id
        },
        select: {
          account: {
            select: {
              email: true,
              name: true,
              surname: true,
            }
          }
        }
      })

      return {
        ...account
      }


    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}