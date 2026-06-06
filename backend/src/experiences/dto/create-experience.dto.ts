import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  columnType: string;

  @IsString()
  year: string;

  @IsString()
  title: string;

  @IsString()
  contentMarkdown: string;

  @IsString()
  @IsOptional()
  stampStatus?: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}
