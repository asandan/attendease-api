import { BadRequestException, Injectable, Put } from "@nestjs/common";
import { Status } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { MedicalCertificationDto, ResolveManyDto } from "./dto";
import { readFileSync } from "fs";
import { getWeeksPassed } from "src/util";


@Injectable()
export class MedicalCertificationService {
  constructor(private readonly prisma: PrismaService) { }

  async getUsersMedicalCertifications(studentId: number, status: Status) {
    try {
      const user = await this.prisma.student.findUnique({
        where: {
          id: studentId
        }
      });

      if (!user) throw new BadRequestException('User not found');

      const filter: Record<string, any> = {
        studentId
      };

      if (status) {
        filter.status = status;
      }
      return (await this.prisma.medicalCertificate.findMany({
        where: {
          ...filter
        }
      })).map(certification => {
        return {
          ...certification,
          picture: readFileSync(certification.path, 'base64'),
          extension: certification.path.split('.').pop()
        }
      })

    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async resolveMany(data: ResolveManyDto[]) {
    try {
      const medicalCertifications = await this.prisma.medicalCertificate.findMany({
        where: {
          id: {
            in: data.map(({ id }) => id)
          },
        },
        select: {
          startDate: true,
          endDate: true,
          studentId: true,
        }
      });

      const studentId = medicalCertifications[0].studentId;

      const { id: groupId } = await this.prisma.student.findUnique({
        where: {
          id: studentId
        }
      }).group();

      if (!groupId) throw new BadRequestException('Group not found');

      const schedule = await this.prisma.schedule.findFirst({
        where: {
          groupId
        }
      });

      if (!schedule) throw new BadRequestException('Schedule not found');

      const weeks = await Promise.all(medicalCertifications.map(async ({ startDate, endDate }) => {
        const [gte, lte] = [getWeeksPassed(startDate), getWeeksPassed(endDate)]
        return await this.prisma.week.findMany({
          where: {
            number: {
              gte,
              lte
            }
          },
          select: {
            id: true,
          }
        })
      }
      ));

      const subjects = await this.prisma.daySubject.findMany({
        where: {
          day: {
            weekId: {
              in: weeks.flat().map(({ id }) => id)
            },
            week: {
              scheduleId: schedule.id
            }

          }
        },
        select: {
          subject: {
            select: {
              id: true,
            }
          },
          day: {
            select: {
              id: true,
              name: true,
              weekId: true,
            },
          },
          startTime: true,
        }
      })

      await Promise.all(data.map(async ({ status }) => {
        if (status === Status.APPROVED) {
          return (await Promise.all(subjects.map(async ({ day, subject, startTime }) => {
            const attendanceSnapshotCount = await this.prisma.attendanceSnapshot.count({
              where: {
                userId: studentId,
                subjectId: subject.id,
                day: day.name,
                weekId: day.weekId,
              }
            });

            const filteredSubjects = subjects.filter(({ day: { id: dayId }, subject: { id: subjectId } }) =>
              dayId === day.id && subject.id === subjectId
            )

            if (attendanceSnapshotCount / filteredSubjects.length !== 1) {
              const data = Array.from({ length: filteredSubjects.length - attendanceSnapshotCount }).map(_ => ({
                weekId: day.weekId,
                subjectId: subject.id,
                time: startTime,
                day: day.name,
                userId: studentId
              })
              )

              return this.prisma.attendanceSnapshot.createMany({
                data
              })
            }
          })))
        }
      }))


      return await Promise.all(data.map(
        async ({ id, status }) => await this.prisma.medicalCertificate.update({
          where: {
            id
          },
          data: {
            status
          }
        })
      ))
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async createMedicalCertification(data: MedicalCertificationDto, path: string, originalName: string) {
    try {
      const { userId, ...otherData } = data;
      const user = await this.prisma.student.findUnique({
        where: {
          id: userId
        }
      });

      if (!user) throw new BadRequestException('User not found');

      return await this.prisma.medicalCertificate.create({
        data: {
          studentId: userId,
          path,
          originalName,
          ...otherData
        }
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}