import {
    IsEmail,
    IsString,
    IsNotEmpty,
    IsInt,
  } from "class-validator";
  import { Transform } from "class-transformer";
  
  export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    name: string;

    @IsString()
    surname: string;

    @IsString()
    @IsNotEmpty()
    password: string;
  
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    roleId: number;
  
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    groupId: number;
  }