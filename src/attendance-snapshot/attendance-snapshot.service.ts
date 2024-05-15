import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAttendanceSnapshotDto, GetWeekAttendanceSnapshotDto } from "./dto";
import { getFullWeekDay, getWeeksPassed, SECOND_SEMESTER_START_DATE } from "src/util";

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
      const student = await this.prismaService.student.findUnique({
        where: {
          id: userId
        }
      });
      if (!student) throw new BadRequestException('User not found');


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
          groupId: student.groupId,
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

      const attendanceData: { [subject: string]: { [day: string]: number } } = {};

      currentWeekSnapshot.days.forEach(({ name, subjects }) => {
        subjects.forEach(({ subject: { name: subjectName } }) => {
          if (!attendanceData[subjectName]) {
            attendanceData[subjectName] = {};
          }
          attendanceData[subjectName][name] = 0;
        });
      });

      attendanceSnapshots.forEach(({ day: dayName, subject: { name: subjectName } }) => {
        if (attendanceData[subjectName] && attendanceData[subjectName][dayName] !== undefined) {
          attendanceData[subjectName][dayName] += 1;
        }
      });

      const attendancePercentages = Object.entries(attendanceData).map(([subject, attendance]) => {
        const subjectAttendance = {
          subject,
        };
        Object.entries(attendance).forEach(([day, attended]) => {
          const totalSubjectsOnDay = currentWeekSnapshot.days.filter(d => d.name === day)[0]?.subjects.filter(s => s.subject.name === subject).length || 0;
          console.log(totalSubjectsOnDay, attended)
          subjectAttendance[day] = totalSubjectsOnDay !== 0 ? attended / totalSubjectsOnDay : 0;
        });
        return subjectAttendance;
      });

      return attendancePercentages;
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
      const currentWeek = getWeeksPassed(new Date())

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