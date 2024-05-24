import { PrismaClient, AttendanceSnapshot } from "@prisma/client";
import { RemoveDefaultFields } from 'src/util/types/utilTypes';

export const addAttendanceSnapshots = async (prisma: PrismaClient) => {
  const students = await prisma.student.findMany();

  const studentSchedules = await Promise.all(students.map(async ({ groupId, id }) => ({
    studentId: id,
    groupId: groupId,
    schedules: await prisma.schedule.findMany({
      where: { groupId },
      select: {
        weeks: {
          select: {
            days: {
              select: {
                subjects: {
                  select: {
                    subjectId: true,
                    startTime: true,
                    day: { select: { name: true } }
                  }
                }
              }
            },
            id: true
          }
        }
      }
    })
  })));

  for (const { schedules, studentId } of studentSchedules) {
    const payload: RemoveDefaultFields<AttendanceSnapshot>[] = [];

    for (const { weeks } of schedules) {
      for (const { days, id: weekId } of weeks) {
        for (const { subjects } of days) {
          const selectedSubjects = subjects.filter(() => Math.random() > 0.3);
          for (const subject of selectedSubjects) {
            payload.push({
              userId: studentId,
              subjectId: subject.subjectId,
              day: subject.day.name,
              weekId: weekId,
              time: subject.startTime
            });
          }
        }
      }
    }

    await prisma.attendanceSnapshot.createMany({ data: payload });
  }
};
