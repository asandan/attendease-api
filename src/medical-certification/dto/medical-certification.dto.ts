import { Status } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";

export class MedicalCertificationDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class ResolveManyDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  id: number;

  @IsString()
  @IsEnum(Status)
  status: Status;
}