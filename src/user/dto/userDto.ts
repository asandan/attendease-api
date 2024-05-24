import { ROLE } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GetUserProfileDto {
  @IsNotEmpty()
  @IsEnum(ROLE)
  role: ROLE;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  id: number;

}
export class UpdateUserProfileDto {
  @IsNotEmpty()
  @IsEnum(ROLE)
  role: ROLE;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  id: number;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  groupId: number;
  
  @IsOptional()
  @IsString()
  name: string;
  
  @IsOptional()
  @IsString()
  surname: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  subjectId: number;
}