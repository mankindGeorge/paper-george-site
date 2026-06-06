import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScrapDto } from './dto/create-scrap.dto';

@Injectable()
export class ScrapsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.scrap.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async create(dto: CreateScrapDto) {
    return this.prisma.scrap.create({ data: dto });
  }

  async update(id: number, dto: Partial<CreateScrapDto>) {
    try {
      return await this.prisma.scrap.update({ where: { id }, data: dto });
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException(`Scrap #${id} not found`);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.scrap.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException(`Scrap #${id} not found`);
      throw error;
    }
  }
}
