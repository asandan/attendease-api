import { Account, Admin, AttendanceSnapshot, EP, Faculty, Group, ROLE, Student, Subject, Teacher } from "@prisma/client";
import { RemoveDefaultFields } from "src/util/types/utilTypes";

export const GROUP_ITEMS: RemoveDefaultFields<Group>[] = [
  {
    name: 'SIS-2201',
    teacherId: 1,
    EPId: 1,
  },
  {
    name: 'SIS-2202',
    teacherId: 1,
    EPId: 2,
  },
  {
    name: "IS-2201",
    teacherId: 1,
    EPId: 3,
  },
  {
    name: "IT-2202",
    teacherId: 1,
    EPId: 4,
  }
];

export const SUBJECT_ITEMS: RemoveDefaultFields<Subject>[] = [
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

export const FACULTY_ITEMS: RemoveDefaultFields<Faculty>[] = [
  {
    name: 'Cyber Security',
  },
  {
    name: 'Informational Technologies'
  }
];

export const EP_ITEMS: RemoveDefaultFields<EP>[] = [
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


export const ACCOUNT_ITEMS: RemoveDefaultFields<Account>[] = [
  {
    name: 'Alice',
    surname: 'Smith',
    email: 'alice.smith@gmail.com',
    password: '123',
    role: ROLE.ADMIN,
  },
  {
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@gmail.com',
    password: 'qwe',
    role: ROLE.TEACHER,
  },
  {
    name: 'Admin',
    surname: 'Admin',
    email: 'admin@gmail.com',
    password: 'qwe',
    role: ROLE.STUDENT,
  },
];

export const ADMIN_ITEMS: RemoveDefaultFields<Admin>[] = [
  {
    accountId: 1,
  }
];

export const TEACHER_ITEMS: RemoveDefaultFields<Teacher>[] = [
  {
    accountId: 2,
    subjectId: 1,
  }
];

export const STUDENT_ITEMS: RemoveDefaultFields<Student>[] = [
  {
    accountId: 3,
    groupId: 1,
  }
]

export const ATTENDANCE_SNAPSHOT_ITEMS: RemoveDefaultFields<AttendanceSnapshot>[] = [
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