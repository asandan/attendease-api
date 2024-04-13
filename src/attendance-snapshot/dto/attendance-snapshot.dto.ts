import { Transform } from "class-transformer";
import { IsDateString, IsNotEmpty } from "class-validator";


export class GetAttendanceSnapsotsDto {
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  userId: number;
}

export class CreateAttendanceSnapshotDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  userId: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  subjectId: number;
}

export class GetWeekAttendanceSnapshotDto {
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  userId: number;
}