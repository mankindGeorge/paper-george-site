import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(dto: CreateMessageDto) {
    const message = await this.prisma.message.create({ data: dto });
    this.mailService.sendContactNotification(dto.name, dto.email, dto.subject, dto.body);
    return message;
  }

  findAll() {
    return this.prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
  }

  markAsRead(id: number) {
    return this.prisma.message.update({ where: { id }, data: { isRead: true } });
  }
}
