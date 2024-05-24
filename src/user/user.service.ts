import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { GetUserProfileDto, UpdateUserProfileDto } from "./dto";
import { Admin, ROLE, Student, Teacher } from "@prisma/client";
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(protected readonly prismaService: PrismaService) { }

  async getUserProfile(data: GetUserProfileDto) {
    try {
      const { id, role } = data;
      console.log(id, role)
      if (role === ROLE.TEACHER) {
        console.log(id, "TEACHER")
        const teacher = await this.prismaService.teacher.findUniqueOrThrow({
          where: {
            id
          },
          include: {
            account: true,
            subject: true,
          }
        })
        console.log(teacher)
        return teacher;
      } else if (role === ROLE.STUDENT) {
        const student = await this.prismaService.student.findUniqueOrThrow({
          where: {
            id
          },
          include: {
            account: true,
            group: {
              include: {
                ep: {
                  include: {
                    faculty: true,
                  }
                }
              }
            }
          },
        })

        return student;
      }

      const admin = await this.prismaService.admin.findUniqueOrThrow({
        where: {
          id
        },
        include: {
          account: true,
        },
      })

      return admin;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async updateProfile(data: UpdateUserProfileDto) {
    try {
      const { id, role, name, surname, password: _password, email, subjectId, groupId } = data;

      const user: Teacher | Student | Admin = await this.prismaService[role.toLowerCase()].findUnique({
        where: {
          id
        }
      });

      const password = bcrypt.hashSync(_password, 10);

      const updatedAccount = await this.prismaService.account.update({
        where: {
          id: user.accountId
        },
        data: {
          name,
          surname,
          password,
          email,
        }
      })

      if (!subjectId || role === ROLE.ADMIN) return updatedAccount;

      if (role === ROLE.STUDENT) {
        const updatedStudent = await this.prismaService.student.update({
          where: {
            id
          },
          data: {
            groupId
          }
        })

        return { updatedStudent, updatedAccount }
      }

      if (role === ROLE.TEACHER) {
        const updatedTeacher = await this.prismaService.teacher.update({
          where: {
            id
          },
          data: {
            subjectId
          }
        })

        return { updatedTeacher, updatedAccount };
      }
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getUsersByRole(role: ROLE) {
    try {
      const user = await this.prismaService[role.toLowerCase()].findMany({
        include: {
          account: true,
        }
      })
      console.log(user)
      return user.map(user => ({ value: user.id, label: `${user.account.name} ${user.account.surname}` }))

    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}