import {
  EPItems,
  facultyItems,
  groupItems,
  roleItems,
  userItems,
} from './data/payloads/index';
import { EP, Faculty, Group, PrismaClient, Role, User } from '@prisma/client';
import addItems from './data/addItems';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding... 🌱');
  try {
    await addItems<Role>(prisma, roleItems, 'role');
    console.log('Role seeding finished.');
    await addItems<Faculty>(prisma, facultyItems, 'faculty');
    console.log('Faculty seeding finished.');
    await addItems<EP>(prisma, EPItems, 'eP');
    console.log('EP seeding finished.');
    await addItems<Group>(prisma, groupItems, 'group');
    console.log('Group seeding finished.');
    await addItems<User>(prisma, userItems, 'user');
    console.log('Users seeding finished.');
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
