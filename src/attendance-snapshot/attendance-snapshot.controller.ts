import { AttendanceSnapshotService } from './attendance-snapshot.service';
import { BadRequestException, Body, Controller, Get, Post } from "@nestjs/common";
import { CreateAttendanceSnapshotDto, GetAttendanceSnapsotsDto, GetWeekAttendanceSnapshotDto } from "./dto";


@Controller('attendance-snapshot')
export class AttendanceSnapshotController {
  constructor(private readonly attendanceSnapshotService: AttendanceSnapshotService){}

  @Get()
  async getAllAttendanceSnapshots(@Body() data: GetAttendanceSnapsotsDto){
    try {
      return await this.attendanceSnapshotService.getAllAttendanceSnapshots(data);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get()
  async getWeekAttendanceSnapshots(@Body() data: GetWeekAttendanceSnapshotDto){
    try {
      return await this.attendanceSnapshotService.getWeekAttendanceSnapshots(data);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post()
  async createAttendanceSnapshot(@Body() data: CreateAttendanceSnapshotDto){
    try {
      return await this.attendanceSnapshotService.createAttendanceSnapshot(data);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

}