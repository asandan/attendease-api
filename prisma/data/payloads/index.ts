import { EP, Faculty } from '@prisma/client';

export const groupItems = [
  {
    name: 'SIS-2201',
    EPId: 1,
  },
  {
    name: 'SIS-2202',
    EPId: 2,
  },
];

export const facultyItems = [
  {
    name: 'Cyber Security',
  },
];

export const EPItems = [
  {
    name: 'Computer Security',
    facultyId: 1,
  },
  {
    name: 'Hardware Security',
    facultyId: 1,
  },
];

export const roleItems = [{ name: 'user' }, { name: 'admin' }];

export const userItems = [
  {
    name: 'Alice',
    surname: 'Smith',
    username: 'alice',
    email: 'alice.smith@gmail.com',
    password: '123',
    roleId: 1,
    groupId: 1,
  },
  {
    name: 'John',
    surname: 'Doe',
    username: 'john',
    email: 'john.doe@gmail.com',
    password: 'qwe',
    roleId: 2,
    groupId: 1,
  },
];
