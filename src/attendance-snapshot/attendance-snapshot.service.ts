import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAttendanceSnapshotDto, GetAttendanceSnapsotsDto, GetWeekAttendanceSnapshotDto } from "./dto";
import { getFormattedDate } from "src/util";

@Injectable({})
export class AttendanceSnapshotService {
  constructor(private readonly prismaService: PrismaService) { }

  async getAllAttendanceSnapshots(data: GetAttendanceSnapsotsDto) {
    try {
      return await this.prismaService.attendanceSnapshot.findMany({
        where: {
          ...data
        }
      })
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async getWeekAttendanceSnapshots(data: GetWeekAttendanceSnapshotDto) {
    try {

      const { startDate, userId } = data

      const user = await this.prismaService.user.findUnique({
        where: {
          id: userId
        }
      })

      if (!user) throw new BadRequestException('User not found')

      let futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);


      const attendanceSnapshotsWeek = await this.prismaService.attendanceSnapshot.findMany({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lte: futureDate
          }
        },
        include: {
          subject: true,
        }
      })

      const scheduleForWeek = await this.prismaService.schedule.findMany({
        where: {
          groupId: user.groupId,
          day: {
            gte: startDate,
            lte: futureDate
          }
        },
        select: {
          subjects: {
            select: {
              name: true,

            }
          },
          day: true
        }
      })

      const attendanceRecords = scheduleForWeek.reduce((acc, schedule) => {
        const { day } = schedule;

        const date = new Date(day).toLocaleDateString("ru-RU");
        const formattedDate = getFormattedDate(date);

        acc[formattedDate] = {};

        schedule.subjects.forEach(subject => {
          if (!acc[formattedDate][subject.name]) {
            acc[formattedDate][subject.name] = 1
          } else {
            acc[formattedDate][subject.name]++
          }
        })
        return acc
      }, {})

      return attendanceSnapshotsWeek.reduce((acc, snapshot) => {
        const { subject: { name }, createdAt } = snapshot;

        const date = new Date(createdAt).toLocaleDateString("ru-RU");
        const formattedDate = getFormattedDate(date);
        const formattedDataIdx = acc.findIndex(data => data.subjectName === name);

        if (formattedDataIdx === -1) {
          acc.push({
            subjectName: name,
            [formattedDate]: { attended: 0, total: attendanceRecords[formattedDate][name] },
          });
        } else {
          acc[formattedDataIdx][formattedDate]['attended']++;
        }

        return acc;
      }, []).map(el => {
        const dateKey = Object.keys(el)[1];
        const ratio = el[dateKey].attended / el[dateKey].total;
        return {
          ...el,
          [dateKey]: ratio
        }
      })

    } catch (e) {
      throw new BadRequestException(e.message);
    }

  }

  async createAttendanceSnapshot(data: CreateAttendanceSnapshotDto) {
    try {

      const user = await this.prismaService.user.findUnique({
        where: {
          id: data.userId
        }
      })
      const subject = await this.prismaService.subject.findUnique({
        where: {
          id: data.subjectId
        }
      })

      if (!user || !subject) throw new Error('User or subject not found')

      return await this.prismaService.attendanceSnapshot.create({ data })
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}