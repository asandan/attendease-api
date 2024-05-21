import { ROLE } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty } from "class-validator";


export class GetUserProfileDto {
  @IsNotEmpty()
  @IsEnum(ROLE)
  role: ROLE;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  id: number;
}