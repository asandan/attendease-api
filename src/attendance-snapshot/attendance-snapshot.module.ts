import { Module } from "@nestjs/common";
import { AttendanceSnapshotService } from "./attendance-snapshot.service";
import { AttendanceSnapshotController } from "./attendance-snapshot.controller";

@Module({
  controllers: [AttendanceSnapshotController],
  providers: [AttendanceSnapshotService],
})
export class AttendanceSnapshotModule { }