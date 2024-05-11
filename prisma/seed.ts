import {
  ATTENDANCE_SNAPSHOT_ITEMS,
  EP_ITEMS,
  FACULTY_ITEMS,
  GROUP_ITEMS,
  ROLE_ITEMS,
  SUBJECT_ITEMS,
  USER_ITEMS,
} from './data/payloads/index';
import { AttendanceSnapshot, EP, Faculty, Group, PrismaClient, Role, Subject, User } from '@prisma/client';
import addItems from './data/addItems';
import addSchedule from './data/addSchedule';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding... 🌱');
  try {
    await addItems<Role>(prisma, ROLE_ITEMS, 'role');
    console.log('Role seeding finished.');
    await addItems<Faculty>(prisma, FACULTY_ITEMS, 'faculty');
    console.log('Faculty seeding finished.');
    await addItems<EP>(prisma, EP_ITEMS, 'eP');
    console.log('EP seeding finished.');
    await addItems<Group>(prisma, GROUP_ITEMS, 'group');
    console.log('Group seeding finished.');
    await addItems<User>(prisma, USER_ITEMS, 'user');
    console.log('Users seeding finished.');
    await addItems<Subject>(prisma, SUBJECT_ITEMS, 'subject');
    console.log('Subject seeding finished.')
    await addSchedule(prisma);
    console.log('Schedule seeding finished.')
    await addItems<AttendanceSnapshot>(prisma, ATTENDANCE_SNAPSHOT_ITEMS, "attendanceSnapshot")
    console.log('AttendanceSnapshot seeding finished.')
  } catch (e) {
    throw new Error(`Error while seeding data: ${e}`);
  }
  console.log('Seeding finished ✅');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
