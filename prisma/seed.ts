import {
  ACCOUNT_ITEMS,
  ADMIN_ITEMS,
  ATTENDANCE_SNAPSHOT_ITEMS,
  EP_ITEMS,
  FACULTY_ITEMS,
  GROUP_ITEMS,
  STUDENT_ITEMS,
  SUBJECT_ITEMS,
  TEACHER_ITEMS,
} from './data/payloads/index';
import { Account, Admin, AttendanceSnapshot, EP, Faculty, Group, PrismaClient, Student, Subject, Teacher } from '@prisma/client';
import addItems from './data/addItems';
import addSchedule from './data/addSchedule';
import { addAttendanceSnapshots } from './data/addAttendanceSnapshots';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding... 🌱');
  try {
    await addItems<Account>(prisma, ACCOUNT_ITEMS, 'account');
    console.log('Account seeding finished.');
    await addItems<Faculty>(prisma, FACULTY_ITEMS, 'faculty');
    console.log('Faculty seeding finished.');
    await addItems<EP>(prisma, EP_ITEMS, 'eP');
    console.log('EP seeding finished.');
    await addItems<Subject>(prisma, SUBJECT_ITEMS, 'subject');
    console.log('Subject seeding finished.')
    await addItems<Teacher>(prisma, TEACHER_ITEMS, 'teacher');
    console.log('Teacher seeding finished.');
    await addItems<Group>(prisma, GROUP_ITEMS, 'group');
    console.log('Group seeding finished.');
    await addItems<Student>(prisma, STUDENT_ITEMS, 'student');
    console.log('Student seeding finished.');
    await addItems<Admin>(prisma, ADMIN_ITEMS, 'admin');
    console.log('Admin seeding finished.');
    await addSchedule(prisma);
    console.log('Schedule seeding finished.')
    await addAttendanceSnapshots(prisma);
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
