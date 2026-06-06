import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { ProjectsModule } from './projects/projects.module';
import { ScrapsModule } from './scraps/scraps.module';
import { MessagesModule } from './messages/messages.module';
import { MailModule } from './mail/mail.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 20,
    }]),
    PrismaModule,
    AuthModule,
    ExperiencesModule,
    ProjectsModule,
    ScrapsModule,
    MessagesModule,
    MailModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
