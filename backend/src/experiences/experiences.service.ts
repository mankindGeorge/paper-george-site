import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(dto: CreateExperienceDto) {
    return this.prisma.experience.create({ data: dto });
  }

  async update(id: number, dto: Partial<CreateExperienceDto>) {
    try {
      return await this.prisma.experience.update({ where: { id }, data: dto });
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException(`Experience #${id} not found`);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.experience.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException(`Experience #${id} not found`);
      throw error;
    }
  }
}
