import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { ProjectsModule } from './projects/projects.module';
import { ScrapsModule } from './scraps/scraps.module';
import { MessagesModule } from './messages/messages.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ExperiencesModule,
    ProjectsModule,
    ScrapsModule,
    MessagesModule,
    MailModule,
  ],
})
export class AppModule {}
