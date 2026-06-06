import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async create(dto: CreateProjectDto) {
    return this.prisma.project.create({ data: dto });
  }

  async update(id: number, dto: Partial<CreateProjectDto>) {
    try {
      return await this.prisma.project.update({ where: { id }, data: dto });
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException(`Project #${id} not found`);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.project.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException(`Project #${id} not found`);
      throw error;
    }
  }
}
