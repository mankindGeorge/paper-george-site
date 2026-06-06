# Mankind George Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack retro newspaper-themed portfolio site with Nuxt 3 frontend, NestJS backend, PostgreSQL database, and Docker production deployment.

**Architecture:** Monorepo with `frontend/` (Nuxt 3) and `backend/` (NestJS). Backend serves REST APIs with Prisma ORM. Frontend consumes APIs and renders 6 newspaper-styled modules. Docker Compose for production.

**Tech Stack:** Nuxt 3, Vue 3 Composition API, Tailwind CSS, NestJS, Prisma, PostgreSQL, bcrypt, JWT, @nestjs-modules/mailer, markdown-it, Docker

---

## Phase 1: Backend Foundation

### Task 1: Initialize NestJS Project

**Files:**
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/tsconfig.build.json`
- Create: `backend/nest-cli.json`
- Create: `backend/src/main.ts`
- Create: `backend/src/app.module.ts`

- [ ] **Step 1: Create backend directory and package.json**

```json
{
  "name": "mankind-george-backend",
  "version": "1.0.0",
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node prisma/seed.ts"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@prisma/client": "^5.9.0",
    "@nestjs-modules/mailer": "^1.11.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "bcrypt": "^5.1.1",
    "class-validator": "^0.14.1",
    "class-transformer": "^0.5.1",
    "reflect-metadata": "^0.2.1",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.3.0",
    "@nestjs/schematics": "^10.1.0",
    "@types/node": "^20.11.0",
    "@types/passport-jwt": "^4.0.1",
    "@types/bcrypt": "^5.0.2",
    "prisma": "^5.9.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}
```

- [ ] **Step 3: Create tsconfig.build.json**

```json
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts", "prisma"]
}
```

- [ ] **Step 4: Create nest-cli.json**

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
```

- [ ] **Step 5: Create src/main.ts**

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
```

- [ ] **Step 6: Create src/app.module.ts**

```typescript
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
```

- [ ] **Step 7: Install dependencies**

Run: `cd backend && npm install`

- [ ] **Step 8: Commit**

```bash
git add backend/
git commit -m "feat: initialize NestJS backend project structure"
```

---

### Task 2: Prisma Schema & Database Setup

**Files:**
- Create: `backend/prisma/schema.prisma`
- Create: `backend/.env`
- Create: `backend/prisma/seed.ts`

- [ ] **Step 1: Create prisma/schema.prisma**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
}

model Experience {
  id              Int      @id @default(autoincrement())
  columnType      String
  year            String
  title           String
  contentMarkdown String   @default("")
  stampStatus     String   @default("published")
  sortOrder       Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([columnType])
}

model Project {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  tags        String[]
  url         String?
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Scrap {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  rotation  Float    @default(0)
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Message {
  id        Int      @id @default(autoincrement())
  name      String
  email     String
  subject   String
  body      String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

- [ ] **Step 2: Create backend/.env**

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mankind_george"
JWT_SECRET="change-this-in-production"
JWT_EXPIRATION="7d"
PORT=3001
FRONTEND_URL="http://localhost:3000"
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="[INSERT_MANKIND_GEORGE_INFO_HERE]"
SMTP_PASS="[INSERT_MANKIND_GEORGE_INFO_HERE]"
SMTP_FROM="noreply@example.com"
```

- [ ] **Step 3: Create prisma/seed.ts**

```typescript
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: '[INSERT_MANKIND_GEORGE_INFO_HERE]',
      password: hashedPassword,
    },
  });

  // Experiences
  const experiences = [
    { columnType: 'early', year: '2018', title: '[INSERT_MANKIND_GEORGE_INFO_HERE]', contentMarkdown: '[INSERT_MANKIND_GEORGE_INFO_HERE]', stampStatus: 'published', sortOrder: 1 },
    { columnType: 'early', year: '2019', title: '[INSERT_MANKIND_GEORGE_INFO_HERE]', contentMarkdown: '[INSERT_MANKIND_GEORGE_INFO_HERE]', stampStatus: 'published', sortOrder: 2 },
    { columnType: 'early', year: '2020', title: '[INSERT_MANKIND_GEORGE_INFO_HERE]', contentMarkdown: '[INSERT_MANKIND_GEORGE_INFO_HERE]', stampStatus: 'published', sortOrder: 3 },
    { columnType: 'engineering', year: '2020', title: '[INSERT_MANKIND_GEORGE_INFO_HERE]', contentMarkdown: '[INSERT_MANKIND_GEORGE_INFO_HERE]', stampStatus: 'published', sortOrder: 1 },
    { columnType: 'engineering', year: '2021', title: '[INSERT_MANKIND_GEORGE_INFO_HERE]', contentMarkdown: '[INSERT_MANKIND_GEORGE_INFO_HERE]', stampStatus: 'published', sortOrder: 2 },
    { columnType: 'engineering', year: '2022', title: '[INSERT_MANKIND_GEORGE_INFO_HERE]', contentMarkdown: '[INSERT_MANKIND_GEORGE_INFO_HERE]', stampStatus: 'published', sortOrder: 3 },
    { columnType: 'open-source', year: '2022', title: '[INSERT_MANKIND_GEORGE_INFO_HERE]', contentMarkdown: '[INSERT_MANKIND_GEORGE_INFO_HERE]', stampStatus: 'published', sortOrder: 1 },
    { columnType: 'open-source', year: '2023', title: '[INSERT_MANKIND_GEORGE_INFO_HERE]', contentMarkdown: '[INSERT_MANKIND_GEORGE_INFO_HERE]', stampStatus: 'published', sortOrder: 2 },
    { columnType: 'open-source', year: '2024', title: '[INSERT_MANKIND_GEORGE_INFO_HERE]', contentMarkdown: '[INSERT_MANKIND_GEORGE_INFO_HERE]', stampStatus: 'published', sortOrder: 3 },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }

  // Projects
  const projects = [
    { title: '[INSERT_MANKIND_GEORGE_INFO_HERE]', description: '[INSERT_MANKIND_GEORGE_INFO_HERE]', tags: ['[INSERT_MANKIND_GEORGE_INFO_HERE]'], url: null, sortOrder: 1 },
    { title: '[INSERT_MANKIND_GEORGE_INFO_HERE]', description: '[INSERT_MANKIND_GEORGE_INFO_HERE]', tags: ['[INSERT_MANKIND_GEORGE_INFO_HERE]'], url: null, sortOrder: 2 },
    { title: '[INSERT_MANKIND_GEORGE_INFO_HERE]', description: '[INSERT_MANKIND_GEORGE_INFO_HERE]', tags: ['[INSERT_MANKIND_GEORGE_INFO_HERE]'], url: null, sortOrder: 3 },
    { title: '[INSERT_MANKIND_GEORGE_INFO_HERE]', description: '[INSERT_MANKIND_GEORGE_INFO_HERE]', tags: ['[INSERT_MANKIND_GEORGE_INFO_HERE]'], url: null, sortOrder: 4 },
  ];

  for (const proj of projects) {
    await prisma.project.create({ data: proj });
  }

  // Scraps
  const scraps = [
    { title: '[INSERT_MANKIND_GEORGE_INFO_HERE]', content: '[INSERT_MANKIND_GEORGE_INFO_HERE]', rotation: 1.5, sortOrder: 1 },
    { title: '[INSERT_MANKIND_GEORGE_INFO_HERE]', content: '[INSERT_MANKIND_GEORGE_INFO_HERE]', rotation: -0.8, sortOrder: 2 },
    { title: '[INSERT_MANKIND_GEORGE_INFO_HERE]', content: '[INSERT_MANKIND_GEORGE_INFO_HERE]', rotation: 0.5, sortOrder: 3 },
    { title: '[INSERT_MANKIND_GEORGE_INFO_HERE]', content: '[INSERT_MANKIND_GEORGE_INFO_HERE]', rotation: -1.2, sortOrder: 4 },
  ];

  for (const scrap of scraps) {
    await prisma.scrap.create({ data: scrap });
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 4: Create src/prisma/prisma.module.ts**

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

- [ ] **Step 5: Create src/prisma/prisma.service.ts**

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

- [ ] **Step 6: Run prisma generate**

Run: `cd backend && npx prisma generate`

- [ ] **Step 7: Commit**

```bash
git add backend/prisma/ backend/src/prisma/ backend/.env
git commit -m "feat: add Prisma schema, seed data, and PrismaService"
```

---

### Task 3: Auth Module (JWT + bcrypt)

**Files:**
- Create: `backend/src/auth/auth.module.ts`
- Create: `backend/src/auth/auth.controller.ts`
- Create: `backend/src/auth/auth.service.ts`
- Create: `backend/src/auth/jwt.strategy.ts`
- Create: `backend/src/auth/jwt-auth.guard.ts`
- Create: `backend/src/auth/dto/login.dto.ts`

- [ ] **Step 1: Create src/auth/dto/login.dto.ts**

```typescript
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

- [ ] **Step 2: Create src/auth/jwt.strategy.ts**

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret',
    });
  }

  async validate(payload: { sub: number; username: string }) {
    return { userId: payload.sub, username: payload.username };
  }
}
```

- [ ] **Step 3: Create src/auth/jwt-auth.guard.ts**

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

- [ ] **Step 4: Create src/auth/auth.service.ts**

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```

- [ ] **Step 5: Create src/auth/auth.controller.ts**

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }
}
```

- [ ] **Step 6: Create src/auth/auth.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

- [ ] **Step 7: Commit**

```bash
git add backend/src/auth/
git commit -m "feat: add JWT auth module with login endpoint"
```

---

### Task 4: Experiences CRUD API

**Files:**
- Create: `backend/src/experiences/experiences.module.ts`
- Create: `backend/src/experiences/experiences.controller.ts`
- Create: `backend/src/experiences/experiences.service.ts`
- Create: `backend/src/experiences/dto/create-experience.dto.ts`

- [ ] **Step 1: Create dto**

```typescript
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  columnType: string;

  @IsString()
  year: string;

  @IsString()
  title: string;

  @IsString()
  contentMarkdown: string;

  @IsString()
  @IsOptional()
  stampStatus?: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}
```

- [ ] **Step 2: Create experiences.service.ts**

```typescript
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
```

- [ ] **Step 3: Create experiences.controller.ts**

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('experiences')
export class ExperiencesController {
  constructor(private experiencesService: ExperiencesService) {}

  @Get()
  findAll(@Query('admin') admin?: string) {
    if (admin === 'true') {
      return this.experiencesService.findAllForAdmin();
    }
    return this.experiencesService.findAll();
  }

  @Get(':columnType')
  findByColumn(@Param('columnType') columnType: string) {
    return this.experiencesService.findByColumn(columnType);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateExperienceDto) {
    return this.experiencesService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateExperienceDto>) {
    return this.experiencesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.experiencesService.remove(id);
  }
}
```

- [ ] **Step 4: Create experiences.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { ExperiencesController } from './experiences.controller';
import { ExperiencesService } from './experiences.service';

@Module({
  controllers: [ExperiencesController],
  providers: [ExperiencesService],
})
export class ExperiencesModule {}
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/experiences/
git commit -m "feat: add Experiences CRUD API"
```

---

### Task 5: Projects CRUD API

**Files:**
- Create: `backend/src/projects/projects.module.ts`
- Create: `backend/src/projects/projects.controller.ts`
- Create: `backend/src/projects/projects.service.ts`
- Create: `backend/src/projects/dto/create-project.dto.ts`

- [ ] **Step 1: Create dto**

```typescript
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  url?: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}
```

- [ ] **Step 2: Create projects.service.ts**

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  create(dto: CreateProjectDto) {
    return this.prisma.project.create({ data: dto });
  }

  update(id: number, dto: Partial<CreateProjectDto>) {
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }
}
```

- [ ] **Step 3: Create projects.controller.ts**

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateProjectDto>) {
    return this.projectsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }
}
```

- [ ] **Step 4: Create projects.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/projects/
git commit -m "feat: add Projects CRUD API"
```

---

### Task 6: Scraps CRUD API

**Files:**
- Create: `backend/src/scraps/scraps.module.ts`
- Create: `backend/src/scraps/scraps.controller.ts`
- Create: `backend/src/scraps/scraps.service.ts`
- Create: `backend/src/scraps/dto/create-scrap.dto.ts`

- [ ] **Step 1: Create dto**

```typescript
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateScrapDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  @IsOptional()
  rotation?: number;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}
```

- [ ] **Step 2: Create scraps.service.ts**

```typescript
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
```

- [ ] **Step 3: Create scraps.controller.ts**

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
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
    return this.scrapsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateScrapDto>) {
    return this.scrapsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.scrapsService.remove(id);
  }
}
```

- [ ] **Step 4: Create scraps.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { ScrapsController } from './scraps.controller';
import { ScrapsService } from './scraps.service';

@Module({
  controllers: [ScrapsController],
  providers: [ScrapsService],
})
export class ScrapsModule {}
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/scraps/
git commit -m "feat: add Scraps CRUD API"
```

---

### Task 7: Messages API + Email Notification

**Files:**
- Create: `backend/src/messages/messages.module.ts`
- Create: `backend/src/messages/messages.controller.ts`
- Create: `backend/src/messages/messages.service.ts`
- Create: `backend/src/messages/dto/create-message.dto.ts`
- Create: `backend/src/mail/mail.module.ts`
- Create: `backend/src/mail/mail.service.ts`

- [ ] **Step 1: Create dto**

```typescript
import { IsString, IsEmail } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  subject: string;

  @IsString()
  body: string;
}
```

- [ ] **Step 2: Create mail.service.ts**

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async sendContactNotification(name: string, email: string, subject: string, body: string) {
    try {
      await this.mailerService.sendMail({
        to: process.env.SMTP_FROM || 'admin@example.com',
        subject: `[Portfolio] New message from ${name}: ${subject}`,
        text: `From: ${name} (${email})\n\n${body}`,
        html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject}</p><hr><p>${body}</p>`,
      });
      this.logger.log(`Contact email sent from ${name}`);
    } catch (error) {
      this.logger.error('Failed to send contact email', error);
    }
  }
}
```

- [ ] **Step 3: Create mail.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST || 'smtp.example.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: process.env.SMTP_FROM || 'noreply@example.com',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
```

- [ ] **Step 4: Create messages.service.ts**

```typescript
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
```

- [ ] **Step 5: Create messages.controller.ts**

```typescript
import { Controller, Get, Post, Put, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  create(@Body() dto: CreateMessageDto) {
    return this.messagesService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.messagesService.markAsRead(id);
  }
}
```

- [ ] **Step 6: Create messages.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
```

- [ ] **Step 7: Commit**

```bash
git add backend/src/messages/ backend/src/mail/
git commit -m "feat: add Messages API with email notification"
```

---

### Task 8: Backend .env.example

**Files:**
- Create: `backend/.env.example`

- [ ] **Step 1: Create .env.example**

```
# === Windows Local Development ===
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mankind_george"

# === Docker Production (docker-compose overrides this) ===
# DATABASE_URL="postgresql://postgres:postgres@postgres-db:5432/mankind_george"

JWT_SECRET="[INSERT_MANKIND_GEORGE_INFO_HERE]"
JWT_EXPIRATION="7d"
PORT=3001
FRONTEND_URL="http://localhost:3000"

SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="[INSERT_MANKIND_GEORGE_INFO_HERE]"
SMTP_PASS="[INSERT_MANKIND_GEORGE_INFO_HERE]"
SMTP_FROM="noreply@example.com"
```

- [ ] **Step 2: Commit**

```bash
git add backend/.env.example
git commit -m "docs: add backend .env.example with local/Docker switching"
```

---

## Phase 2: Frontend Foundation

### Task 9: Initialize Nuxt 3 Project

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/nuxt.config.ts`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/assets/css/main.css`
- Create: `frontend/app.vue`

- [ ] **Step 1: Create frontend/package.json**

```json
{
  "name": "mankind-george-frontend",
  "private": true,
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "generate": "nuxt generate"
  },
  "dependencies": {
    "nuxt": "^3.14.0",
    "vue": "^3.5.0",
    "vue-router": "^4.4.0",
    "markdown-it": "^14.0.0"
  },
  "devDependencies": {
    "@nuxtjs/tailwindcss": "^6.12.0",
    "@nuxtjs/google-fonts": "^3.2.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "@types/markdown-it": "^14.0.0"
  }
}
```

- [ ] **Step 2: Create nuxt.config.ts**

```typescript
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001',
    },
  },
  googleFonts: {
    families: {
      'Playfair Display': [400, 700, 900],
      'Source Sans 3': [300, 400, 600],
      'IBM Plex Mono': [400, 500],
    },
    display: 'swap',
  },
  app: {
    head: {
      title: 'Mankind George Chronicle',
      meta: [
        { name: 'description', content: 'Portfolio and blog of Mankind George' },
      ],
    },
  },
})
```

- [ ] **Step 3: Create tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        newsprint: '#F2EFE9',
        ink: '#1E1E1E',
        stamp: '#A64444',
        cardboard: '#DCD7C9',
      },
      fontFamily: {
        headline: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Source Sans 3"', 'Arial', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'Courier New', 'monospace'],
      },
      boxShadow: {
        hard: '5px 5px 0px #1E1E1E',
        'hard-sm': '3px 3px 0px #1E1E1E',
        'hard-lg': '8px 8px 0px #1E1E1E',
      },
      clipPath: {
        'torn-1': 'polygon(0% 3%, 2% 0%, 5% 4%, 8% 1%, 12% 5%, 15% 2%, 18% 6%, 22% 1%, 25% 4%, 28% 0%, 32% 3%, 35% 1%, 38% 5%, 42% 2%, 45% 6%, 48% 0%, 52% 4%, 55% 1%, 58% 5%, 62% 2%, 65% 6%, 68% 0%, 72% 3%, 75% 1%, 78% 5%, 82% 2%, 85% 4%, 88% 0%, 92% 3%, 95% 1%, 98% 4%, 100% 2%, 100% 97%, 98% 100%, 95% 96%, 92% 99%, 88% 97%, 85% 100%, 82% 96%, 78% 99%, 75% 97%, 72% 100%, 68% 96%, 65% 99%, 62% 97%, 58% 100%, 55% 96%, 52% 99%, 48% 97%, 45% 100%, 42% 96%, 38% 99%, 35% 97%, 32% 100%, 28% 96%, 25% 99%, 22% 97%, 18% 100%, 15% 96%, 12% 99%, 8% 97%, 5% 100%, 2% 96%, 0% 99%)',
        'torn-2': 'polygon(0% 2%, 3% 5%, 7% 1%, 10% 4%, 14% 0%, 17% 3%, 21% 5%, 24% 1%, 27% 4%, 30% 0%, 33% 3%, 37% 5%, 40% 1%, 43% 4%, 47% 0%, 50% 3%, 53% 5%, 57% 1%, 60% 4%, 63% 0%, 67% 3%, 70% 5%, 73% 1%, 77% 4%, 80% 0%, 83% 3%, 87% 5%, 90% 1%, 93% 4%, 97% 0%, 100% 3%, 100% 98%, 97% 95%, 93% 99%, 90% 96%, 87% 100%, 83% 97%, 80% 95%, 77% 99%, 73% 96%, 70% 100%, 67% 97%, 63% 95%, 60% 99%, 57% 96%, 53% 100%, 50% 97%, 47% 95%, 43% 99%, 40% 96%, 37% 100%, 33% 97%, 30% 95%, 27% 99%, 24% 96%, 21% 100%, 17% 97%, 14% 95%, 10% 99%, 7% 96%, 3% 100%, 0% 97%)',
      },
      keyframes: {
        unfold: {
          '0%': { transform: 'perspective(800px) rotateX(-90deg)', opacity: '0' },
          '60%': { transform: 'perspective(800px) rotateX(5deg)' },
          '100%': { transform: 'perspective(800px) rotateX(0deg)', opacity: '1' },
        },
        'stamp-down': {
          '0%': { transform: 'scale(1.5) rotate(-5deg)', opacity: '0' },
          '70%': { transform: 'scale(0.95) rotate(1deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'spring-open': {
          '0%': { maxHeight: '0px', opacity: '0' },
          '70%': { maxHeight: '120%' },
          '100%': { maxHeight: '100%', opacity: '1' },
        },
        'slide-out': {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(120%) rotate(3deg)', opacity: '0' },
        },
      },
      animation: {
        unfold: 'unfold 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        stamp: 'stamp-down 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'spring-open': 'spring-open 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-out': 'slide-out 0.6s ease-in forwards',
      },
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 4: Create assets/css/main.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-newsprint text-ink font-body;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-headline;
  }

  code, pre, .font-mono {
    @apply font-mono;
  }
}
```

- [ ] **Step 5: Create app.vue**

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- [ ] **Step 6: Install dependencies**

Run: `cd frontend && npm install`

- [ ] **Step 7: Commit**

```bash
git add frontend/
git commit -m "feat: initialize Nuxt 3 frontend with Tailwind and design system"
```

---

### Task 10: Composables (useApi, useAuth)

**Files:**
- Create: `frontend/composables/useApi.ts`
- Create: `frontend/composables/useAuth.ts`

- [ ] **Step 1: Create composables/useApi.ts**

```typescript
export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  const get = <T>(path: string) => $fetch<T>(`${apiBase}${path}`)
  const post = <T>(path: string, body: any) => $fetch<T>(`${apiBase}${path}`, { method: 'POST', body })
  const put = <T>(path: string, body: any) => $fetch<T>(`${apiBase}${path}`, { method: 'PUT', body })
  const del = <T>(path: string) => $fetch<T>(`${apiBase}${path}`, { method: 'DELETE' })

  return { get, post, put, del }
}
```

- [ ] **Step 2: Create composables/useAuth.ts**

```typescript
interface AuthState {
  token: string | null
  isAuthenticated: boolean
}

export const useAuth = () => {
  const token = useState<string | null>('auth-token', () => null)
  const isAuthenticated = computed(() => !!token.value)

  const login = async (username: string, password: string) => {
    const config = useRuntimeConfig()
    const result = await $fetch<{ access_token: string }>(`${config.public.apiBase}/api/auth/login`, {
      method: 'POST',
      body: { username, password },
    })
    token.value = result.access_token
    if (import.meta.client) {
      localStorage.setItem('auth-token', result.access_token)
    }
  }

  const logout = () => {
    token.value = null
    if (import.meta.client) {
      localStorage.removeItem('auth-token')
    }
    navigateTo('/admin/login')
  }

  const init = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem('auth-token')
      if (stored) token.value = stored
    }
  }

  const authHeaders = computed(() => token.value ? { Authorization: `Bearer ${token.value}` } : {})

  return { token, isAuthenticated, login, logout, init, authHeaders }
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/composables/
git commit -m "feat: add useApi and useAuth composables"
```

---

### Task 11: Shared Components (TornEdge, StampSeal, PerforatedLine)

**Files:**
- Create: `frontend/components/TornEdge.vue`
- Create: `frontend/components/StampSeal.vue`
- Create: `frontend/components/PerforatedLine.vue`

- [ ] **Step 1: Create TornEdge.vue**

```vue
<template>
  <div class="w-full overflow-hidden" :class="containerClass">
    <svg
      class="w-full"
      :class="svgClass"
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        :d="variant === 'top' ? topPath : bottomPath"
        :fill="color"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'top' | 'bottom'
  color?: string
  containerClass?: string
  svgClass?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'bottom',
  color: '#F2EFE9',
  containerClass: '',
  svgClass: 'h-8',
})

const topPath = 'M0,40 L0,25 Q30,20 60,28 Q90,35 120,22 Q150,15 180,27 Q210,33 240,20 Q270,12 300,25 Q330,32 360,18 Q390,10 420,24 Q450,30 480,16 Q510,8 540,22 Q570,30 600,18 Q630,10 660,26 Q690,33 720,20 Q750,12 780,28 Q810,35 840,22 Q870,14 900,26 Q930,32 960,18 Q990,10 1020,24 Q1050,30 1080,16 Q1110,8 1140,22 Q1170,28 1200,20 L1200,40 Z'
const bottomPath = 'M0,0 L0,15 Q30,20 60,12 Q90,5 120,18 Q150,25 180,13 Q210,7 240,20 Q270,28 300,15 Q330,8 360,22 Q390,30 420,16 Q450,10 480,24 Q510,32 540,18 Q570,10 600,22 Q630,30 660,14 Q690,7 720,20 Q750,28 780,12 Q810,5 840,18 Q870,26 900,14 Q930,8 960,22 Q990,30 1020,16 Q1050,10 1080,24 Q1110,32 1140,18 Q1170,12 1200,20 L1200,0 Z'
</script>
```

- [ ] **Step 2: Create StampSeal.vue**

```vue
<template>
  <div
    class="inline-flex items-center justify-center border-2 border-stamp rounded-full px-3 py-1"
    :class="[sizeClass, animate ? 'animate-stamp' : '']"
  >
    <span class="font-mono text-stamp uppercase tracking-wider" :class="textClass">
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text: string
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  animate: false,
})

const sizeClass = computed(() => {
  const sizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }
  return sizes[props.size]
})

const textClass = computed(() => {
  const sizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }
  return sizes[props.size]
})

const props = defineProps<{ text: string; size?: 'sm' | 'md' | 'lg'; animate?: boolean }>()
</script>
```

- [ ] **Step 3: Create PerforatedLine.vue**

```vue
<template>
  <div class="flex items-stretch" :class="containerClass">
    <div
      v-for="(tag, i) in tags"
      :key="i"
      class="group cursor-pointer border-r-2 border-dashed border-ink/30 px-3 py-2 last:border-r-0 transition-all duration-200"
      :class="[
        isActive(i) ? 'bg-ink text-newsprint' : 'bg-newsprint text-ink',
        itemClass
      ]"
      @click="toggle(i)"
    >
      <span class="font-mono text-xs uppercase tracking-widest">[{{ tag }}]</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  tags: string[]
  containerClass?: string
  itemClass?: string
}

defineProps<Props>()

const activeIndex = ref<number | null>(null)

const toggle = (i: number) => {
  activeIndex.value = activeIndex.value === i ? null : i
}

const isActive = (i: number) => activeIndex.value === i
</script>
```

- [ ] **Step 4: Commit**

```bash
git add frontend/components/
git commit -m "feat: add shared components (TornEdge, StampSeal, PerforatedLine)"
```

---

### Task 12: Layouts

**Files:**
- Create: `frontend/layouts/default.vue`
- Create: `frontend/layouts/admin.vue`

- [ ] **Step 1: Create default.vue layout**

```vue
<template>
  <div class="min-h-screen bg-newsprint">
    <slot />
    <TornEdge variant="bottom" color="#DCD7C9" svgClass="h-10" />
  </div>
</template>
```

- [ ] **Step 2: Create admin.vue layout**

```vue
<template>
  <div class="min-h-screen bg-ink text-newsprint font-mono">
    <header class="border-b-2 border-stamp p-4 flex justify-between items-center">
      <h1 class="font-headline text-xl">EDITOR'S CONTROL DESK</h1>
      <button
        v-if="isAuthenticated"
        class="border-2 border-stamp px-4 py-1 text-stamp hover:bg-stamp hover:text-newsprint transition-colors"
        @click="logout"
      >LOGOUT</button>
    </header>
    <main class="p-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, logout, init } = useAuth()

onMounted(() => {
  init()
  if (!isAuthenticated.value) {
    navigateTo('/admin/login')
  }
})
</script>
```

- [ ] **Step 3: Commit**

```bash
git add frontend/layouts/
git commit -m "feat: add default and admin layouts"
```

---

### Task 13: Frontend .env.example

**Files:**
- Create: `frontend/.env`

- [ ] **Step 1: Create frontend/.env**

```
# === Windows Local Development ===
NUXT_PUBLIC_API_BASE=http://localhost:3001

# === Docker Production (docker-compose overrides this) ===
# NUXT_PUBLIC_API_BASE=http://backend:3001
```

- [ ] **Step 2: Commit**

```bash
git add frontend/.env
git commit -m "docs: add frontend .env with local/Docker API base"
```

---

## Phase 3: Frontend Modules

### Task 14: Module 1 — Frontpage Broadside (首页)

**Files:**
- Create: `frontend/pages/index.vue`
- Create: `frontend/components/Masthead.vue`
- Create: `frontend/components/NewsGrid.vue`

- [ ] **Step 1: Create Masthead.vue**

```vue
<template>
  <div class="border-b-4 border-double border-ink pt-8 pb-4 text-center animate-unfold">
    <h1 class="font-headline text-5xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-none">
      THE MANKIND GEORGE CHRONICLE
    </h1>
    <div class="mt-4 flex items-center justify-center gap-4 border-y-2 border-ink py-2">
      <span class="font-mono text-sm uppercase tracking-widest">{{ currentDate }}</span>
      <span class="text-ink">|</span>
      <span class="font-mono text-sm uppercase tracking-widest">SYSTEM STATUS: OPERATIONAL</span>
      <span class="text-ink">|</span>
      <span class="font-mono text-sm uppercase tracking-widest">VOL. I, NO. 1</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})
</script>
```

- [ ] **Step 2: Create NewsGrid.vue**

```vue
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-ink">
    <div
      v-for="(item, i) in items"
      :key="i"
      class="bg-newsprint p-4"
      :class="item.span ? 'md:col-span-2' : ''"
    >
      <h3 class="font-headline text-lg font-bold border-b-2 border-ink pb-1 mb-2">{{ item.title }}</h3>
      <p class="text-sm leading-relaxed font-body">{{ item.content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: Array<{ title: string; content: string; span?: boolean }> }>()
</script>
```

- [ ] **Step 3: Create pages/index.vue**

```vue
<template>
  <div>
    <Masthead />
    <div class="p-4 md:p-8">
      <NewsGrid :items="gridItems" />
    </div>
    <TornEdge variant="bottom" color="#DCD7C9" svgClass="h-12" />
  </div>
</template>

<script setup lang="ts">
const { get } = useApi()

const [projects, scraps] = await Promise.all([
  get<any[]>('/api/projects'),
  get<any[]>('/api/scraps'),
])

const gridItems = computed(() => {
  const items = []
  if (projects.length > 0) {
    items.push({ title: projects[0].title, content: projects[0].description, span: true })
  }
  scraps.slice(0, 3).forEach((s: any) => {
    items.push({ title: s.title, content: s.content })
  })
  projects.slice(1, 4).forEach((p: any) => {
    items.push({ title: p.title, content: p.description })
  })
  return items
})
</script>
```

- [ ] **Step 4: Commit**

```bash
git add frontend/pages/index.vue frontend/components/Masthead.vue frontend/components/NewsGrid.vue
git commit -m "feat: add Module 1 - Frontpage Broadside"
```

---

### Task 15: Module 2 — Editorial Clippings (关于我)

**Files:**
- Create: `frontend/pages/about.vue`
- Create: `frontend/components/ScrapCard.vue`

- [ ] **Step 1: Create ScrapCard.vue**

```vue
<template>
  <div
    class="group relative bg-newsprint border-2 border-ink p-4 cursor-pointer transition-all duration-200 ease-out"
    :style="{ transform: `rotate(${scrap.rotation}deg)` }"
    :class="[
      'hover:rotate-0 hover:-translate-y-1 hover:z-50 hover:shadow-hard',
    ]"
  >
    <div class="absolute inset-0 bg-newsprint opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    <div class="relative z-10">
      <h3 class="font-headline text-lg font-bold border-b border-ink/30 pb-1 mb-2">{{ scrap.title }}</h3>
      <p class="text-sm leading-relaxed font-body">{{ scrap.content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  scrap: { id: number; title: string; content: string; rotation: number }
}>()
</script>
```

- [ ] **Step 2: Create pages/about.vue**

```vue
<template>
  <div class="bg-cardboard min-h-screen p-4 md:p-8">
    <h2 class="font-headline text-3xl md:text-4xl font-black text-center mb-8 border-b-4 border-double border-ink pb-4">
      THE EDITORIAL CLIPPINGS
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <ScrapCard v-for="scrap in scraps" :key="scrap.id" :scrap="scrap" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { get } = useApi()
const { data: scraps } = await useAsyncData('scraps', () => get<any[]>('/api/scraps'))
</script>
```

- [ ] **Step 3: Commit**

```bash
git add frontend/pages/about.vue frontend/components/ScrapCard.vue
git commit -m "feat: add Module 2 - Editorial Clippings"
```

---

### Task 16: Module 3 — Classified Ads (项目作品集)

**Files:**
- Create: `frontend/pages/projects.vue`
- Create: `frontend/components/ProjectCard.vue`

- [ ] **Step 1: Create ProjectCard.vue**

```vue
<template>
  <div class="border border-ink bg-newsprint">
    <div class="p-4">
      <h3 class="font-headline text-xl font-bold border-b-2 border-ink pb-2 mb-2">{{ project.title }}</h3>
      <p class="text-sm leading-relaxed font-body mb-3">{{ project.description }}</p>
      <a
        v-if="project.url"
        :href="project.url"
        target="_blank"
        class="font-mono text-xs text-stamp underline"
      >VIEW PROJECT &rarr;</a>
    </div>
    <PerforatedLine :tags="project.tags" />
    <div
      v-if="expanded"
      class="border-t-2 border-ink p-4 bg-cardboard animate-spring-open overflow-hidden"
    >
      <p class="font-mono text-xs text-ink/70 mb-2">PROJECT DETAILS</p>
      <p class="text-sm font-body">{{ project.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  project: { id: number; title: string; description: string; tags: string[]; url?: string }
}>()

const expanded = ref(false)
</script>
```

- [ ] **Step 2: Create pages/projects.vue**

```vue
<template>
  <div class="p-4 md:p-8">
    <h2 class="font-headline text-3xl md:text-4xl font-black text-center mb-2 border-b-4 border-double border-ink pb-4">
      THE CLASSIFIED ADS
    </h2>
    <p class="text-center font-mono text-xs text-ink/60 mb-8 uppercase tracking-widest">PROJECT PORTFOLIO &amp; TECHNICAL INDEX</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink max-w-5xl mx-auto">
      <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { get } = useApi()
const { data: projects } = await useAsyncData('projects', () => get<any[]>('/api/projects'))
</script>
```

- [ ] **Step 3: Commit**

```bash
git add frontend/pages/projects.vue frontend/components/ProjectCard.vue
git commit -m "feat: add Module 3 - Classified Ads"
```

---

### Task 17: Module 4 — Milestone Chronicle (个人经历)

**Files:**
- Create: `frontend/pages/experience.vue`
- Create: `frontend/components/ExperienceCard.vue`

- [ ] **Step 1: Create ExperienceCard.vue**

```vue
<template>
  <div class="border-2 border-ink bg-newsprint mb-4 overflow-hidden">
    <div
      class="flex items-start gap-3 p-4 cursor-pointer select-none"
      @click="toggle"
    >
      <div class="flex-1">
        <span class="font-mono text-xs text-ink/60">{{ experience.year }}</span>
        <h4 class="font-headline text-lg font-bold leading-tight">{{ experience.title }}</h4>
      </div>
      <StampSeal :text="experience.stampStatus" size="sm" />
    </div>
    <div
      v-show="isOpen"
      class="px-4 pb-4 border-t border-ink/20 animate-spring-open"
    >
      <div class="prose prose-sm max-w-none font-body pt-3" v-html="renderedContent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

const props = defineProps<{
  experience: { id: number; year: string; title: string; contentMarkdown: string; stampStatus: string }
}>()

const isOpen = ref(false)
const toggle = () => { isOpen.value = !isOpen.value }

const renderedContent = computed(() => md.render(props.experience.contentMarkdown || ''))
</script>
```

- [ ] **Step 2: Create pages/experience.vue**

```vue
<template>
  <div class="p-4 md:p-8">
    <h2 class="font-headline text-3xl md:text-4xl font-black text-center mb-2 border-b-4 border-double border-ink pb-4">
      THE MILESTONE CHRONICLE
    </h2>
    <p class="text-center font-mono text-xs text-ink/60 mb-8 uppercase tracking-widest">HISTORICAL DOCUMENTATION SPECIAL EDITION</p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
      <div v-for="col in columns" :key="col.type">
        <h3 class="font-headline text-xl font-bold border-b-2 border-ink pb-2 mb-4 text-center uppercase">
          {{ col.label }}
        </h3>
        <ExperienceCard
          v-for="exp in byColumn(col.type)"
          :key="exp.id"
          :experience="exp"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { get } = useApi()
const { data: experiences } = await useAsyncData('experiences', () => get<any[]>('/api/experiences'))

const columns = [
  { type: 'early', label: 'Early Inquiry & Academic Record' },
  { type: 'engineering', label: 'Engineering Practice & Deep Research' },
  { type: 'open-source', label: 'Open Source Manifesto & Infrastructure Chronicle' },
]

const byColumn = (type: string) => (experiences.value || []).filter((e: any) => e.columnType === type)
</script>
```

- [ ] **Step 3: Commit**

```bash
git add frontend/pages/experience.vue frontend/components/ExperienceCard.vue
git commit -m "feat: add Module 4 - Milestone Chronicle"
```

---

### Task 18: Module 5 — Letter to the Editor (联络方式)

**Files:**
- Create: `frontend/pages/contact.vue`

- [ ] **Step 1: Create pages/contact.vue**

```vue
<template>
  <div class="min-h-screen flex items-center justify-center p-4 md:p-8">
    <div
      class="w-full max-w-lg bg-newsprint border-2 border-ink p-8 relative"
      :class="{ 'animate-slide-out': submitted }"
    >
      <h2 class="font-headline text-3xl font-black text-center mb-2">LETTER TO THE EDITOR</h2>
      <p class="text-center font-mono text-xs text-ink/60 mb-8 uppercase tracking-widest">CORRESPONDENCE &amp; INQUIRIES</p>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="font-mono text-xs uppercase tracking-widest block mb-1">Your Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full bg-transparent border-b-2 border-ink py-2 font-body text-sm focus:outline-none"
          />
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest block mb-1">Your Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full bg-transparent border-b-2 border-ink py-2 font-body text-sm focus:outline-none"
          />
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest block mb-1">Subject</label>
          <input
            v-model="form.subject"
            type="text"
            required
            class="w-full bg-transparent border-b-2 border-ink py-2 font-body text-sm focus:outline-none"
          />
        </div>
        <div>
          <label class="font-mono text-xs uppercase tracking-widest block mb-1">Message</label>
          <textarea
            v-model="form.body"
            rows="5"
            required
            class="w-full bg-transparent border-b-2 border-ink py-2 font-body text-sm focus:outline-none resize-none"
          />
        </div>
        <button
          type="submit"
          class="w-full border-2 border-ink bg-ink text-newsprint py-3 font-headline text-lg uppercase tracking-wider hover:bg-stamp hover:border-stamp transition-colors active:scale-95"
          :disabled="sending"
        >
          {{ sending ? 'SENDING...' : 'STAMP & SEND' }}
        </button>
      </form>

      <div v-if="submitted" class="absolute inset-0 flex items-center justify-center bg-newsprint">
        <div class="text-center animate-stamp">
          <StampSeal text="SENT" size="lg" />
          <p class="font-mono text-sm mt-4">Your letter has been received.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { post } = useApi()

const form = reactive({ name: '', email: '', subject: '', body: '' })
const sending = ref(false)
const submitted = ref(false)

const handleSubmit = async () => {
  sending.value = true
  try {
    await post('/api/messages', form)
    submitted.value = true
  } catch (e) {
    console.error(e)
  } finally {
    sending.value = false
  }
}
</script>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/pages/contact.vue
git commit -m "feat: add Module 5 - Letter to the Editor"
```

---

### Task 19: Navigation Bar

**Files:**
- Create: `frontend/components/NavBar.vue`
- Modify: `frontend/layouts/default.vue`

- [ ] **Step 1: Create NavBar.vue**

```vue
<template>
  <nav class="border-b-2 border-ink bg-newsprint sticky top-0 z-40">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
      <NuxtLink to="/" class="font-headline text-lg font-bold tracking-tight uppercase">M.G.C.</NuxtLink>
      <div class="flex items-center gap-1 md:gap-4">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="font-mono text-xs uppercase tracking-widest px-2 py-1 hover:bg-ink hover:text-newsprint transition-colors"
          active-class="bg-ink text-newsprint"
        >{{ link.label }}</NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const links = [
  { to: '/', label: 'Front' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/experience', label: 'Chronicle' },
  { to: '/contact', label: 'Contact' },
]
</script>
```

- [ ] **Step 2: Update layouts/default.vue**

```vue
<template>
  <div class="min-h-screen bg-newsprint">
    <NavBar />
    <slot />
    <TornEdge variant="bottom" color="#DCD7C9" svgClass="h-10" />
  </div>
</template>
```

- [ ] **Step 3: Commit**

```bash
git add frontend/components/NavBar.vue frontend/layouts/default.vue
git commit -m "feat: add navigation bar"
```

---

## Phase 4: Admin Dashboard (Module 6)

### Task 20: Admin Login Page

**Files:**
- Create: `frontend/pages/admin/login.vue`

- [ ] **Step 1: Create pages/admin/login.vue**

```vue
<template>
  <NuxtLayout name="admin">
    <div class="min-h-[80vh] flex items-center justify-center">
      <div class="w-full max-w-sm border-2 border-stamp p-8">
        <h2 class="font-headline text-2xl text-center mb-6 text-stamp">CONTROL DESK ACCESS</h2>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">Username</label>
            <input
              v-model="username"
              type="text"
              class="w-full bg-transparent border-b-2 border-stamp py-2 font-mono text-newsprint text-sm focus:outline-none"
            />
          </div>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">Password</label>
            <input
              v-model="password"
              type="password"
              class="w-full bg-transparent border-b-2 border-stamp py-2 font-mono text-newsprint text-sm focus:outline-none"
            />
          </div>
          <p v-if="error" class="text-stamp font-mono text-xs">{{ error }}</p>
          <button
            type="submit"
            class="w-full border-2 border-stamp text-stamp py-2 font-headline uppercase tracking-wider hover:bg-stamp hover:text-ink transition-colors"
          >AUTHENTICATE</button>
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { login } = useAuth()
const username = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  try {
    await login(username.value, password.value)
    navigateTo('/admin')
  } catch (e) {
    error.value = 'ACCESS DENIED — INVALID CREDENTIALS'
  }
}
</script>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/pages/admin/login.vue
git commit -m "feat: add admin login page"
```

---

### Task 21: Admin Dashboard Pages

**Files:**
- Create: `frontend/pages/admin/index.vue`
- Create: `frontend/pages/admin/experiences.vue`
- Create: `frontend/pages/admin/projects.vue`
- Create: `frontend/pages/admin/scraps.vue`
- Create: `frontend/pages/admin/messages.vue`
- Create: `frontend/components/admin/AdminTable.vue`
- Create: `frontend/components/admin/AdminForm.vue`

- [ ] **Step 1: Create AdminTable.vue**

```vue
<template>
  <div class="border-2 border-stamp overflow-x-auto">
    <table class="w-full text-left font-mono text-sm">
      <thead>
        <tr class="border-b-2 border-stamp bg-ink/20">
          <th v-for="col in columns" :key="col.key" class="px-4 py-2 uppercase tracking-widest text-xs">{{ col.label }}</th>
          <th class="px-4 py-2 uppercase tracking-widest text-xs">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id" class="border-b border-stamp/30 hover:bg-stamp/10">
          <td v-for="col in columns" :key="col.key" class="px-4 py-2">{{ item[col.key] }}</td>
          <td class="px-4 py-2 flex gap-2">
            <button class="text-stamp underline text-xs" @click="$emit('edit', item)">EDIT</button>
            <button class="text-stamp/60 underline text-xs" @click="$emit('delete', item.id)">DEL</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  columns: Array<{ key: string; label: string }>
  items: any[]
}>()

defineEmits(['edit', 'delete'])
</script>
```

- [ ] **Step 2: Create AdminForm.vue**

```vue
<template>
  <div class="border-2 border-stamp p-6">
    <h3 class="font-headline text-lg text-stamp mb-4">{{ title }}</h3>
    <form @submit.prevent="$emit('submit', form)" class="space-y-4">
      <slot :form="form" />
      <div class="flex gap-4">
        <button
          type="submit"
          class="border-2 border-stamp px-4 py-2 font-mono text-xs uppercase tracking-widest hover:bg-stamp hover:text-ink transition-colors"
        >{{ submitLabel }}</button>
        <button
          type="button"
          class="border-2 border-stamp/30 px-4 py-2 font-mono text-xs uppercase tracking-widest hover:border-stamp transition-colors"
          @click="$emit('cancel')"
        >CANCEL</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  submitLabel?: string
  form: any
}>()

defineEmits(['submit', 'cancel'])
</script>
```

- [ ] **Step 3: Create pages/admin/index.vue**

```vue
<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <h2 class="font-headline text-2xl text-stamp border-b-2 border-stamp pb-2">CONTROL DESK — OVERVIEW</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink
          v-for="link in adminLinks"
          :key="link.to"
          :to="link.to"
          class="border-2 border-stamp p-4 hover:bg-stamp/20 transition-colors"
        >
          <h3 class="font-headline text-lg text-stamp">{{ link.title }}</h3>
          <p class="font-mono text-xs text-newsprint/60 mt-1">{{ link.desc }}</p>
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const adminLinks = [
  { to: '/admin/experiences', title: 'EXPERIENCES', desc: 'Milestone Chronicle entries' },
  { to: '/admin/projects', title: 'PROJECTS', desc: 'Classified Ads portfolio' },
  { to: '/admin/scraps', title: 'SCRAPS', desc: 'Editorial Clippings' },
  { to: '/admin/messages', title: 'MESSAGES', desc: 'Letters to the Editor' },
]
</script>
```

- [ ] **Step 4: Create pages/admin/experiences.vue**

```vue
<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <div class="flex justify-between items-center border-b-2 border-stamp pb-2">
        <h2 class="font-headline text-2xl text-stamp">EXPERIENCES</h2>
        <button
          class="border-2 border-stamp px-4 py-1 font-mono text-xs uppercase tracking-widest hover:bg-stamp hover:text-ink transition-colors"
          @click="showForm = !showForm"
        >{{ showForm ? 'CLOSE' : '+ NEW' }}</button>
      </div>

      <AdminForm
        v-if="showForm"
        :title="editingId ? 'EDIT EXPERIENCE' : 'NEW EXPERIENCE'"
        :form="form"
        submit-label="SAVE"
        @submit="saveExperience"
        @cancel="resetForm"
      >
        <template #default>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="font-mono text-xs uppercase tracking-widest block mb-1">Column</label>
              <select v-model="form.columnType" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint">
                <option value="early">Early Inquiry</option>
                <option value="engineering">Engineering</option>
                <option value="open-source">Open Source</option>
              </select>
            </div>
            <div>
              <label class="font-mono text-xs uppercase tracking-widest block mb-1">Year</label>
              <input v-model="form.year" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
            </div>
          </div>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">Title</label>
            <input v-model="form.title" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
          </div>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">Content (Markdown)</label>
            <textarea v-model="form.contentMarkdown" rows="6" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint resize-y" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="font-mono text-xs uppercase tracking-widest block mb-1">Status</label>
              <select v-model="form.stampStatus" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label class="font-mono text-xs uppercase tracking-widest block mb-1">Sort Order</label>
              <input v-model.number="form.sortOrder" type="number" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
            </div>
          </div>
        </template>
      </AdminForm>

      <AdminTable
        :columns="columns"
        :items="experiences"
        @edit="editExperience"
        @delete="deleteExperience"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { get, post, put, del } = useApi()
const { authHeaders } = useAuth()

const experiences = ref<any[]>([])
const showForm = ref(false)
const editingId = ref<number | null>(null)

const form = reactive({
  columnType: 'early',
  year: '',
  title: '',
  contentMarkdown: '',
  stampStatus: 'published',
  sortOrder: 0,
})

const columns = [
  { key: 'year', label: 'Year' },
  { key: 'columnType', label: 'Column' },
  { key: 'title', label: 'Title' },
  { key: 'stampStatus', label: 'Status' },
]

const loadExperiences = async () => {
  experiences.value = await get<any[]>('/api/experiences?admin=true')
}

const saveExperience = async () => {
  if (editingId.value) {
    await put(`/api/experiences/${editingId.value}`, { ...form })
  } else {
    await post('/api/experiences', { ...form })
  }
  resetForm()
  await loadExperiences()
}

const editExperience = (item: any) => {
  Object.assign(form, item)
  editingId.value = item.id
  showForm.value = true
}

const deleteExperience = async (id: number) => {
  await del(`/api/experiences/${id}`)
  await loadExperiences()
}

const resetForm = () => {
  Object.assign(form, { columnType: 'early', year: '', title: '', contentMarkdown: '', stampStatus: 'published', sortOrder: 0 })
  editingId.value = null
  showForm.value = false
}

onMounted(loadExperiences)
</script>
```

- [ ] **Step 5: Create pages/admin/projects.vue**

```vue
<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <div class="flex justify-between items-center border-b-2 border-stamp pb-2">
        <h2 class="font-headline text-2xl text-stamp">PROJECTS</h2>
        <button
          class="border-2 border-stamp px-4 py-1 font-mono text-xs uppercase tracking-widest hover:bg-stamp hover:text-ink transition-colors"
          @click="showForm = !showForm"
        >{{ showForm ? 'CLOSE' : '+ NEW' }}</button>
      </div>

      <AdminForm
        v-if="showForm"
        :title="editingId ? 'EDIT PROJECT' : 'NEW PROJECT'"
        :form="form"
        submit-label="SAVE"
        @submit="saveProject"
        @cancel="resetForm"
      >
        <template #default>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">Title</label>
            <input v-model="form.title" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
          </div>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">Description</label>
            <textarea v-model="form.description" rows="3" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint resize-y" />
          </div>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">Tags (comma-separated)</label>
            <input v-model="tagsInput" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
          </div>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">URL</label>
            <input v-model="form.url" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
          </div>
        </template>
      </AdminForm>

      <AdminTable
        :columns="columns"
        :items="projects"
        @edit="editProject"
        @delete="deleteProject"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { get, post, put, del } = useApi()

const projects = ref<any[]>([])
const showForm = ref(false)
const editingId = ref<number | null>(null)
const tagsInput = ref('')

const form = reactive({ title: '', description: '', tags: [] as string[], url: '', sortOrder: 0 })

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'tags', label: 'Tags' },
]

const loadProjects = async () => {
  projects.value = await get<any[]>('/api/projects')
}

const saveProject = async () => {
  form.tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  if (editingId.value) {
    await put(`/api/projects/${editingId.value}`, { ...form })
  } else {
    await post('/api/projects', { ...form })
  }
  resetForm()
  await loadProjects()
}

const editProject = (item: any) => {
  Object.assign(form, item)
  tagsInput.value = (item.tags || []).join(', ')
  editingId.value = item.id
  showForm.value = true
}

const deleteProject = async (id: number) => {
  await del(`/api/projects/${id}`)
  await loadProjects()
}

const resetForm = () => {
  Object.assign(form, { title: '', description: '', tags: [], url: '', sortOrder: 0 })
  tagsInput.value = ''
  editingId.value = null
  showForm.value = false
}

onMounted(loadProjects)
</script>
```

- [ ] **Step 6: Create pages/admin/scraps.vue**

```vue
<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <div class="flex justify-between items-center border-b-2 border-stamp pb-2">
        <h2 class="font-headline text-2xl text-stamp">SCRAPS</h2>
        <button
          class="border-2 border-stamp px-4 py-1 font-mono text-xs uppercase tracking-widest hover:bg-stamp hover:text-ink transition-colors"
          @click="showForm = !showForm"
        >{{ showForm ? 'CLOSE' : '+ NEW' }}</button>
      </div>

      <AdminForm
        v-if="showForm"
        :title="editingId ? 'EDIT SCRAP' : 'NEW SCRAP'"
        :form="form"
        submit-label="SAVE"
        @submit="saveScrap"
        @cancel="resetForm"
      >
        <template #default>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">Title</label>
            <input v-model="form.title" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
          </div>
          <div>
            <label class="font-mono text-xs uppercase tracking-widest block mb-1">Content</label>
            <textarea v-model="form.content" rows="4" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint resize-y" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="font-mono text-xs uppercase tracking-widest block mb-1">Rotation (deg)</label>
              <input v-model.number="form.rotation" type="number" step="0.1" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
            </div>
            <div>
              <label class="font-mono text-xs uppercase tracking-widest block mb-1">Sort Order</label>
              <input v-model.number="form.sortOrder" type="number" class="w-full bg-ink border-2 border-stamp p-2 font-mono text-sm text-newsprint" />
            </div>
          </div>
        </template>
      </AdminForm>

      <AdminTable
        :columns="columns"
        :items="scraps"
        @edit="editScrap"
        @delete="deleteScrap"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { get, post, put, del } = useApi()

const scraps = ref<any[]>([])
const showForm = ref(false)
const editingId = ref<number | null>(null)

const form = reactive({ title: '', content: '', rotation: 0, sortOrder: 0 })

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'content', label: 'Content' },
  { key: 'rotation', label: 'Rotation' },
]

const loadScraps = async () => {
  scraps.value = await get<any[]>('/api/scraps')
}

const saveScrap = async () => {
  if (editingId.value) {
    await put(`/api/scraps/${editingId.value}`, { ...form })
  } else {
    await post('/api/scraps', { ...form })
  }
  resetForm()
  await loadScraps()
}

const editScrap = (item: any) => {
  Object.assign(form, item)
  editingId.value = item.id
  showForm.value = true
}

const deleteScrap = async (id: number) => {
  await del(`/api/scraps/${id}`)
  await loadScraps()
}

const resetForm = () => {
  Object.assign(form, { title: '', content: '', rotation: 0, sortOrder: 0 })
  editingId.value = null
  showForm.value = false
}

onMounted(loadScraps)
</script>
```

- [ ] **Step 7: Create pages/admin/messages.vue**

```vue
<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <h2 class="font-headline text-2xl text-stamp border-b-2 border-stamp pb-2">MESSAGES</h2>
      <div v-if="messages.length === 0" class="font-mono text-sm text-newsprint/60">NO MESSAGES YET.</div>
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="border-2 border-stamp p-4"
        :class="{ 'opacity-50': msg.isRead }"
      >
        <div class="flex justify-between items-start mb-2">
          <div>
            <span class="font-mono text-xs text-stamp">{{ msg.name }}</span>
            <span class="font-mono text-xs text-newsprint/60 ml-2">&lt;{{ msg.email }}&gt;</span>
          </div>
          <span class="font-mono text-xs text-newsprint/40">{{ new Date(msg.createdAt).toLocaleDateString() }}</span>
        </div>
        <h4 class="font-headline text-lg text-newsprint">{{ msg.subject }}</h4>
        <p class="font-body text-sm text-newsprint/80 mt-2">{{ msg.body }}</p>
        <button
          v-if="!msg.isRead"
          class="mt-3 font-mono text-xs text-stamp underline"
          @click="markRead(msg.id)"
        >MARK AS READ</button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { get, put } = useApi()

const messages = ref<any[]>([])

const loadMessages = async () => {
  messages.value = await get<any[]>('/api/messages')
}

const markRead = async (id: number) => {
  await put(`/api/messages/${id}/read`, {})
  await loadMessages()
}

onMounted(loadMessages)
</script>
```

- [ ] **Step 8: Commit**

```bash
git add frontend/pages/admin/ frontend/components/admin/
git commit -m "feat: add admin dashboard with CRUD for all modules"
```

---

## Phase 5: Docker & Deployment

### Task 22: Backend Dockerfile

**Files:**
- Create: `backend/Dockerfile`
- Create: `backend/.dockerignore`

- [ ] **Step 1: Create Dockerfile**

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
EXPOSE 3001
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
```

- [ ] **Step 2: Create .dockerignore**

```
node_modules
dist
.env
.git
```

- [ ] **Step 3: Commit**

```bash
git add backend/Dockerfile backend/.dockerignore
git commit -m "feat: add backend Dockerfile"
```

---

### Task 23: Frontend Dockerfile

**Files:**
- Create: `frontend/Dockerfile`
- Create: `frontend/.dockerignore`

- [ ] **Step 1: Create Dockerfile**

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

- [ ] **Step 2: Create .dockerignore**

```
node_modules
.output
.nuxt
.git
```

- [ ] **Step 3: Commit**

```bash
git add frontend/Dockerfile frontend/.dockerignore
git commit -m "feat: add frontend Dockerfile"
```

---

### Task 24: Docker Compose & Root .env.example

**Files:**
- Create: `docker-compose.yml`
- Create: `.env.example`

- [ ] **Step 1: Create docker-compose.yml**

```yaml
version: '3.8'

services:
  postgres-db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: mankind_george
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5433:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://${DB_USER:-postgres}:${DB_PASSWORD:-postgres}@postgres-db:5432/mankind_george
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRATION: 7d
      PORT: 3001
      FRONTEND_URL: http://localhost:3000
      SMTP_HOST: ${SMTP_HOST}
      SMTP_PORT: ${SMTP_PORT}
      SMTP_USER: ${SMTP_USER}
      SMTP_PASS: ${SMTP_PASS}
      SMTP_FROM: ${SMTP_FROM}
    depends_on:
      postgres-db:
        condition: service_healthy

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NUXT_PUBLIC_API_BASE: http://backend:3001
    depends_on:
      - backend

volumes:
  pgdata:
```

- [ ] **Step 2: Create root .env.example**

```
# ============================================
# MANKIND GEORGE PORTFOLIO — ENVIRONMENT CONFIG
# ============================================

# --- Database ---
DB_USER=postgres
DB_PASSWORD=postgres

# --- Auth ---
JWT_SECRET="[INSERT_MANKIND_GEORGE_INFO_HERE]"

# --- SMTP (Contact Form Email) ---
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="[INSERT_MANKIND_GEORGE_INFO_HERE]"
SMTP_PASS="[INSERT_MANKIND_GEORGE_INFO_HERE]"
SMTP_FROM="noreply@example.com"

# ============================================
# NOTES:
#
# LOCAL DEVELOPMENT (Windows native):
#   - Run PostgreSQL locally on port 5432
#   - Frontend: cd frontend && npm run dev (port 3000)
#   - Backend:  cd backend && npm run start:dev (port 3001)
#   - API base: http://localhost:3001
#
# DOCKER PRODUCTION:
#   - docker-compose up -d
#   - DB connects to postgres-db:5432 (internal)
#   - Frontend connects to backend:3001 (internal)
#   - Ports exposed: 3000 (frontend), 3001 (backend), 5433 (DB)
# ============================================
```

- [ ] **Step 3: Commit**

```bash
git add docker-compose.yml .env.example
git commit -m "feat: add Docker Compose and root .env.example"
```

---

### Task 25: Root README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Write README.md**

```markdown
# Mankind George Portfolio

Retro newspaper-themed personal portfolio and blog.

## Tech Stack

- **Frontend:** Nuxt 3, Vue 3, Tailwind CSS
- **Backend:** NestJS, Prisma, PostgreSQL
- **Production:** Docker Compose

## Local Development (Windows)

### Prerequisites
- Node.js 20+
- PostgreSQL running locally on port 5432

### Setup

```bash
# 1. Create database
psql -U postgres -c "CREATE DATABASE mankind_george;"

# 2. Backend
cd backend
cp .env.example .env    # edit DATABASE_URL if needed
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev       # http://localhost:3001

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev             # http://localhost:3000
```

## Docker Production

```bash
cp .env.example .env    # configure secrets
docker-compose up -d    # frontend:3000, backend:3001, db:5433
```

## Admin Dashboard

Navigate to `/admin`, login with credentials from seed data.

## Environment Variables

See `.env.example` for all configuration options.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add project README with setup instructions"
```

---

## Implementation Order Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1-8 | Backend: NestJS, Prisma, Auth, all CRUD APIs, email |
| 2 | 9-13 | Frontend: Nuxt 3, Tailwind, composables, components, layouts |
| 3 | 14-19 | Frontend Modules: All 6 pages + navigation |
| 4 | 20-21 | Admin Dashboard: Login + CRUD pages |
| 5 | 22-25 | Docker: Dockerfiles, Compose, README |
