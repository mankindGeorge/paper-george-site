import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ScrapsService } from './scraps.service';
import { CreateScrapDto } from './dto/create-scrap.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('scraps')
export class ScrapsController {
  constructor(private scrapsService: ScrapsService) {}

  @Get()
  findAll() {
    return this.scrapsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateScrapDto) {
    if (!dto.content && !dto.imageUrl) {
      throw new BadRequestException('内容和图片至少填写一项');
    }
    return this.scrapsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateScrapDto>) {
    if (!dto.content && !dto.imageUrl) {
      throw new BadRequestException('内容和图片至少填写一项');
    }
    return this.scrapsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.scrapsService.remove(id);
  }
}
