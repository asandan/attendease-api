import { PrismaClient, Schedule, WeekDays } from "@prisma/client";

const addSchedule = async (prisma: PrismaClient) => {
  const startTimes = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ];

  const subjectData = await prisma.subject.findMany();

  const totalGroups = await prisma.group.count();

  const schedule = await prisma.schedule.create({
    data: { groupId: Math.floor(Math.random() * totalGroups) + 1 },
  });

  for (let i = 1; i <= 15; i++) {
    await prisma.week.create({
      data: {
        number: i,
        scheduleId: schedule.id,
        days: {
          create: Object.values(WeekDays).map((weekday) => ({
            name: weekday,
            subjects: {
              create: {
                subjectId: subjectData[Math.floor(Math.random() * subjectData.length)].id,
                startTime:
                  startTimes[Math.floor(Math.random() * startTimes.length)]
                ,
              },
            },
          })),
        },
      },
    });
  }
}

export default addSchedule;