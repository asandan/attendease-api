import { Status } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";

export class MedicalCertificationDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDate()
  startDate: Date;
  
  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}

export class ResolveManyDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  id: number;

  @IsString()
  @IsEnum(Status)
  status: Status;
}