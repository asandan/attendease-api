import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsEnum,
} from "class-validator";
import { Transform } from "class-transformer";
import { ROLE } from "@prisma/client";

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsString()
  surname: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(ROLE)
  @IsOptional()
  role: ROLE;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  groupId: number;
  
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  subjectId: number;
}
