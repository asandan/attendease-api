import { Transform } from 'class-transformer';
import { IsDefined, IsInt, IsOptional } from 'class-validator';

export class CommonQuery {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  id: number;

  @IsDefined()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  take: number;

  @IsDefined()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  skip: number;

  @IsOptional()
  sort: string;
}