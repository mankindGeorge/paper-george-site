import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateScrapDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsOptional()
  rotation?: number;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;
}
