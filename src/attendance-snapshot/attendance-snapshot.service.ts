import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAttendanceSnapshotDto, GetWeekAttendanceSnapshotDto } from "./dto";
import { TotalSubjectsForWeekEntry, getFullWeekDay, getWeeksPassed } from "src/util";

@Injectable({})
export class AttendanceSnapshotService {
  constructor(private readonly prismaService: PrismaService) { }

  async getAllAttendanceSnapshots() {
    try {
      return await this.prismaService.attendanceSnapshot.findMany();
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getWeekAttendanceSnapshots(data: GetWeekAttendanceSnapshotDto) {
    const { userId, currentWeek } = data;
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: userId
        }
      });

      if (!user) throw new BadRequestException('User not found');


      const attendanceSnapshots = await this.prismaService.attendanceSnapshot.findMany({
        where: {
          userId,
          week: {
            id: currentWeek
          }
        },
        select: {
          subject: true,
          day: true,
        }
      })

      const schedule = await this.prismaService.schedule.findFirst({
        where: {
          groupId: user.groupId,
        }
      })

      const currentWeekSnapshot = await this.prismaService.week.findFirstOrThrow({
        where: {
          number: currentWeek,
          scheduleId: schedule.id
        },
        select: {
          days: {
            select: {
              name: true,
              subjects: {
                select: {
                  subject: true,
                }
              }
            }
          }
        }
      });

      const totalSubjectsForWeekEntry: TotalSubjectsForWeekEntry[] = currentWeekSnapshot.days.map(({ name, subjects }) => {
        const subjectsMap = subjects.reduce((acc, { subject: { name: subjectName } }) => {
          acc[subjectName] = { attended: 0, total: (acc[subjectName]?.total || 0) + 1 };
          return acc;
        }, {} as { [subjectName: string]: { attended: number; total: number } });

        return { day: name, subjects: subjectsMap };
      });

      attendanceSnapshots.forEach(({ day: dayName, subject: { name: subjectName } }) => {
        const entry = totalSubjectsForWeekEntry.find(entry => entry.day === dayName);
        if (entry && entry.subjects[subjectName]) {
          entry.subjects[subjectName].attended++;
        }
      });

      return totalSubjectsForWeekEntry.map(entry => {
        const subjects = Object.fromEntries(Object.entries(entry.subjects).map(([subjectName, { attended, total }]) => {
          return [subjectName, attended / total];
        }));
        return { day: entry.day, ...subjects };
      });

    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async createSnapshot(data: CreateAttendanceSnapshotDto) {
    try {
      const { userId } = data;

      const today = new Date();
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      const currentDay = getFullWeekDay(today.getDay());
      const currentWeek = getWeeksPassed(new Date("January 23, 2024"))

      if (currentHour > 18 || currentHour < 8) {
        throw new BadRequestException("Cannot create attendance snapshot")
      }

      if (currentMinute > 10) {
        throw new BadRequestException("User has been late for class")
      }

      const time = `${currentHour}:00`

      if (!currentDay) {
        throw new BadRequestException("Today's Sunday")
      }

      const { id: weekId } = await this.prismaService.week.findFirst({
        where: {
          number: currentWeek,
        },
        select: {
          id: true,
        }
      })

      const { subject: { id: subjectId } } = await this.prismaService.daySubject.findFirst({
        where: {
          startTime: time
        },
        select: {
          subject: {
            select: {
              id: true,
            }
          }
        }
      })

      const payload = {
        day: currentDay,
        time,
        weekId,
        subjectId,
        userId,
      }

      return await this.prismaService.attendanceSnapshot.create({
        data: payload
      })
    } catch (e) {
      throw new BadRequestException(e)
    }
  }
}