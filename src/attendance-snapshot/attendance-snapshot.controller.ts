import { AttendanceSnapshotService } from './attendance-snapshot.service';
import { BadRequestException, Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateAttendanceSnapshotDto } from "./dto";


@Controller('attendance-snapshot')
export class AttendanceSnapshotController {
  constructor(private readonly attendanceSnapshotService: AttendanceSnapshotService) { }

  @Get()
  async getAllAttendanceSnapshots() {
    try {
      return await this.attendanceSnapshotService.getAllAttendanceSnapshots();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get("/get-attendance-rows/:userId/:currentWeek")
  async getWeekAttendanceSnapshots(@Param("userId") userIdStr: string, @Param("currentWeek") currentWeekStr: string) {
    try {
      const userId = +userIdStr
      const currentWeek = +currentWeekStr
      return await this.attendanceSnapshotService.getWeekAttendanceSnapshots({ userId, currentWeek });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post()
  async createAttendanceSnapshot(@Body() data: CreateAttendanceSnapshotDto) {
    try {
      return await this.attendanceSnapshotService.createSnapshot(data);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

}