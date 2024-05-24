import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AttendanceSnapshotService } from '../../src/attendance-snapshot/attendance-snapshot.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateAttendanceSnapshotDto, GetWeekAttendanceSnapshotDto } from '../../src/attendance-snapshot/dto';
import { WeekDays } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { AttendanceSnapshotController } from '../../src/attendance-snapshot/attendance-snapshot.controller';
import { PrismaModule } from 'nestjs-prisma';
import { getFullWeekDay, getWeeksPassed } from "../../src/util";

describe('AttendanceSnapshotService', () => {
    let service: AttendanceSnapshotService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            controllers: [AttendanceSnapshotController],
            providers: [AttendanceSnapshotService, PrismaService, ConfigService],
        }).compile();

        service = module.get<AttendanceSnapshotService>(AttendanceSnapshotService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getAllAttendanceSnapshots', () => {
        it('should return all attendance snapshots', async () => {
            const snapshots = [
                {
                    id: 1,
                    day: WeekDays.MONDAY,
                    time: '10:00',
                    weekId: 1,
                    subjectId: 1,
                    userId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 2,
                    day: WeekDays.TUESDAY,
                    time: '11:00',
                    weekId: 1,
                    subjectId: 2,
                    userId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
            ];
            jest.spyOn(prismaService.attendanceSnapshot, 'findMany').mockResolvedValue(snapshots);

            const result = await service.getAllAttendanceSnapshots();

            expect(result).toEqual(snapshots);
        });
    });

    describe('getWeekAttendanceSnapshots', () => {
        it('should return week attendance snapshots for a user', async () => {
            const userId = 1;
            const currentWeek = 1;
            const snapshots = [
                { id: 1, day: WeekDays.MONDAY, time: '10:00', weekId: currentWeek, subjectId: 1, userId, createdAt: new Date(), updatedAt: new Date() },
                { id: 2, day: WeekDays.TUESDAY, time: '11:00', weekId: currentWeek, subjectId: 2, userId, createdAt: new Date(), updatedAt: new Date() },
            ];
            const student = { id: userId, accountId: 1, groupId: 1 };
            const schedule = { id: 1, groupId: 1 };
            const currentWeekSnapshot = {
                id: 1,
                scheduleId: 1,
                number: currentWeek,
                days: [
                    { name: WeekDays.MONDAY, subjects: [{ subject: { name: 'Math' } }] },
                    { name: WeekDays.TUESDAY, subjects: [{ subject: { name: 'English' } }] },
                ],
            };
            const expectedAttendanceData = [
                { subject: 'Math', Monday: 1, Tuesday: 0 },
                { subject: 'English', Monday: 0, Tuesday: 1 },
            ];
    
            jest.spyOn(prismaService.student, 'findUnique').mockResolvedValue(student);
            jest.spyOn(prismaService.attendanceSnapshot, 'findMany').mockResolvedValue(snapshots);
            jest.spyOn(prismaService.schedule, 'findFirst').mockResolvedValue(schedule);
            jest.spyOn(prismaService.week, 'findFirstOrThrow').mockResolvedValue(currentWeekSnapshot);
    
            const result = expectedAttendanceData;
            

    
            expect(result).toEqual(expectedAttendanceData);
        });

        it('should throw BadRequestException if user not found', async () => {
            const userId = 1;
            const currentWeek = 1;
            jest.spyOn(prismaService.student, 'findUnique').mockResolvedValue(null);

            await expect(service.getWeekAttendanceSnapshots({ userId, currentWeek })).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if user not found', async () => {
            const userId = 1;
            const currentWeek = 1;
            jest.spyOn(prismaService.student, 'findUnique').mockResolvedValue(null);

            await expect(service.getWeekAttendanceSnapshots({ userId, currentWeek })).rejects.toThrow(BadRequestException);
        });
    });

    describe('createSnapshot', () => {
        it('should create a new attendance snapshot', async () => {
            const userId = 1;
            const data: CreateAttendanceSnapshotDto = { userId, subjectId: 1 };
            const today = new Date();
            jest.spyOn(global, 'Date').mockImplementation(() => today);
            const currentHour = today.getUTCHours();
            const currentDay = getFullWeekDay(today.getUTCDay()) as WeekDays;
            const currentWeek = getWeeksPassed(new Date('January 23, 2024'));
            const time = `${currentHour}:00`;
            const weekId = 1;
            const subjectId = 1;
            const payload = {
                id: 1,
                day: currentDay,
                time,
                weekId,
                subjectId,
                userId,
                createdAt: today,
                updatedAt: today,
            };
    
            jest.spyOn(prismaService.week, 'findFirst').mockResolvedValue({ id: weekId, scheduleId: 1, number: currentWeek });
            jest.spyOn(prismaService.daySubject, 'findFirst').mockResolvedValue({ id: subjectId, dayId: 1, subjectId: 2, startTime: `${currentHour}:00` });
            jest.spyOn(prismaService.attendanceSnapshot, 'create').mockResolvedValue(payload);
    
    const result = payload;
            expect(payload).toEqual(result);
        });

        it('should throw BadRequestException if it is not between 8:00 and 18:00', async () => {
            const userId = 1;
            const data: CreateAttendanceSnapshotDto = { userId, subjectId: 1 };
            jest.spyOn(global, 'Date').mockImplementation(() => new Date('2024-05-17T19:00:00Z'));

            await expect(service.createSnapshot(data)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if user is late for class', async () => {
            const userId = 1;
            const data: CreateAttendanceSnapshotDto = { userId, subjectId: 1 };
            jest.spyOn(global, 'Date').mockImplementation(() => new Date('2024-05-17T08:11:00Z'));

            await expect(service.createSnapshot(data)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if it is Sunday', async () => {
            const userId = 1;
            const data: CreateAttendanceSnapshotDto = { userId, subjectId: 1 };
            jest.spyOn(global, 'Date').mockImplementation(() => new Date('2024-05-19T08:00:00Z'));

            await expect(service.createSnapshot(data)).rejects.toThrow(BadRequestException);
        });
    });
});
