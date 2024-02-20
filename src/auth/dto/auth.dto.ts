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
    @IsNotEmpty()
    username: string;
  
    @IsEmail()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
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