import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class MedicalCertificationDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}