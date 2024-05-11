import { AttendanceSnapshot, User } from "@prisma/client";

export const GROUP_ITEMS = [
  {
    name: 'SIS-2201',
    EPId: 1,
  },
  {
    name: 'SIS-2202',
    EPId: 2,
  },
  {
    name: "IS-2201",
    EPId: 3,
  },
  {
    name: "IT-2202",
    EPId: 4,
  }
];

export const SUBJECT_ITEMS = [
  {
    name: 'Math',
  },
  {
    name: 'Physics',
  },
  {
    name: "Programming",
  },
  {
    name: "Databases",
  },
  {
    name: "Networks",
  },
  {
    name: "Security",
  },
  {
    name: "Web Technologies",
  },
  {
    name: "Java OOP",
  },
  {
    name: "Psychology",
  }
];

export const FACULTY_ITEMS = [
  {
    name: 'Cyber Security',
  },
  {
    name: 'Informational Technologies'
  }
];

export const EP_ITEMS = [
  {
    name: 'Computer Security',
    facultyId: 1,
  },
  {
    name: 'Hardware Security',
    facultyId: 1,
  },
  {
    name: "Information Systems",
    facultyId: 2,
  },
  {
    name: "Software Development",
    facultyId: 2,
  }
];

export const ROLE_ITEMS = [{ name: 'user' }, { name: 'admin' }];

export const USER_ITEMS: Omit<User, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: 'Alice',
    surname: 'Smith',
    email: 'alice.smith@gmail.com',
    password: '123',
    roleId: 1,
    groupId: 1,
  },
  {
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@gmail.com',
    password: 'qwe',
    roleId: 2,
    groupId: 1,
  },
];

export const ATTENDANCE_SNAPSHOT_ITEMS: Omit<AttendanceSnapshot, "id" | "createdAt" | "updatedAt">[] = [
  {
    day: "MONDAY",
    time: "17:00",
    subjectId: 4,
    userId: 1,
    weekId: 1,
  },
  {
    day: "TUESDAY",
    time: "16:00",
    subjectId: 5,
    userId: 1,
    weekId: 1,
  },
  {
    day: "WEDNESDAY",
    time: "11:00",
    subjectId: 2,
    userId: 1,
    weekId: 1,
  },
  {
    day: "THURSDAY",
    time: "16:00",
    subjectId: 8,
    userId: 1,
    weekId: 1,
  },
  {
    day: "FRIDAY",
    time: "13:00",
    subjectId: 1,
    userId: 1,
    weekId: 1,
  },
  {
    day: "SATURDAY",
    time: "15:00",
    subjectId: 6,
    userId: 1,
    weekId: 1,
  },
]