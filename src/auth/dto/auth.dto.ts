import {
    IsEmail,
    IsString,
    IsNotEmpty,
    IsInt,
    IsOptional,
  } from "class-validator";
  import { Transform } from "class-transformer";
  
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
    
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    roleId: number;
    
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    groupId: number;
  }
