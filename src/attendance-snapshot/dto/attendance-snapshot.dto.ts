import { Transform } from "class-transformer";
import { IsDateString, IsNotEmpty } from "class-validator";


export class CreateAttendanceSnapshotDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  userId: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  subjectId: number;
}

export class GetWeekAttendanceSnapshotDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  currentWeek: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  userId: number;
}