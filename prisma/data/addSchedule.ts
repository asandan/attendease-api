import { PrismaClient, Week, WeekDays } from "@prisma/client";

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
  const groups = await prisma.group.findMany();

  for (const group of groups) {
    await prisma.schedule.create({
      data: { groupId: group.id },
    });
  }

  const schedules = await prisma.schedule.findMany();

  const getRandomScheduleForDay = () => {
    const subjectsPerDay = Math.floor(Math.random() * 5 + 1);
    return Array.from({ length: subjectsPerDay }, () => ({
      subjectId: subjectData[Math.floor(Math.random() * subjectData.length)].id,
      startTime: startTimes[Math.floor(Math.random() * startTimes.length)],
    }));
  };

  const scheduleForWeek: ReturnType<typeof getRandomScheduleForDay>[] = [];

  for (let i = 0; i < 6; i++) {
    scheduleForWeek.push(getRandomScheduleForDay());
  }

  for (const schedule of schedules) {
    const weeks: Week[] = [];

    for (let i = 0; i < 15; i++) {
      const week = await prisma.week.create({
        data: {
          number: i + 1,
          scheduleId: schedule.id,
          days: {
            create: Object.values(WeekDays).map((weekday) => ({
              name: weekday,
            })),
          },
        },
      });
      weeks.push(week);
    }

    for (const week of weeks) {
      const days = await prisma.day.findMany({
        where: { weekId: week.id },
        select: { id: true, name: true },
      });

      for (let i = 0; i < days.length; i++) {
        await prisma.daySubject.createMany({
          data: scheduleForWeek[i].map((subject) => ({
            dayId: days[i].id,
            subjectId: subject.subjectId,
            startTime: subject.startTime,
          })),
        });
      }
    }
  }
};

export default addSchedule;
