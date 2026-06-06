import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.experience.findMany({
      where: { stampStatus: 'published' },
      orderBy: { sortOrder: 'asc' },
    });
  }

  findByColumn(columnType: string) {
    return this.prisma.experience.findMany({
      where: { columnType, stampStatus: 'published' },
      orderBy: { sortOrder: 'asc' },
    });
  }

  findAllForAdmin() {
    return this.prisma.experience.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  create(dto: CreateExperienceDto) {
    return this.prisma.experience.create({ data: dto });
  }

  update(id: number, dto: Partial<CreateExperienceDto>) {
    return this.prisma.experience.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.experience.delete({ where: { id } });
  }
}
