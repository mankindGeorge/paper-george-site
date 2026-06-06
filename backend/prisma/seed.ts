import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.upsert({
    where: { username: ADMIN_USERNAME },
    update: { password: hashedPassword },
    create: {
      username: ADMIN_USERNAME,
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
