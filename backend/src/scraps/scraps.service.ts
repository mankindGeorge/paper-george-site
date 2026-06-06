import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScrapDto } from './dto/create-scrap.dto';

@Injectable()
export class ScrapsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.scrap.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  create(dto: CreateScrapDto) {
    return this.prisma.scrap.create({ data: dto });
  }

  update(id: number, dto: Partial<CreateScrapDto>) {
    return this.prisma.scrap.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.scrap.delete({ where: { id } });
  }
}
