import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateScrapDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  @IsOptional()
  rotation?: number;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}
