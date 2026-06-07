import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export enum StampStatus {
  published = 'published',
  draft = 'draft',
  archived = 'archived',
}

export class CreateExperienceDto {
  @IsString()
  columnType: string;

  @IsString()
  year: string;

  @IsString()
  title: string;

  @IsString()
  contentMarkdown: string;

  @IsEnum(StampStatus)
  @IsOptional()
  stampStatus?: StampStatus;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;
}
