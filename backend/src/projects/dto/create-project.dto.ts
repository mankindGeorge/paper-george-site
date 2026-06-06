import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  url?: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}
