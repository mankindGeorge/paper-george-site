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

  // Experiences - delete and recreate for idempotency
  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: [
      // 早期探索与学术记录
      { columnType: 'early', year: '2024', title: '入学广东财经大学', contentMarkdown: '2024年9月，正式成为广东财经大学数字经济学院的一员，就读数据科学与大数据技术（智能计算）专业。从广东揭阳惠来来到广州&佛山，开启人生新篇章。', stampStatus: 'published', sortOrder: 1 },
      { columnType: 'early', year: '2024', title: '初识编程世界', contentMarkdown: '大一入学后第一次接触Python编程，从"Hello World"开始，逐步理解变量、循环、函数的概念。虽然一开始写代码总是报错，但每次解决问题都充满成就感。', stampStatus: 'published', sortOrder: 2 },
      { columnType: 'early', year: '2025', title: '数据思维觉醒', contentMarkdown: '在《数据科学导论》课程中，第一次理解了数据背后的商业价值。开始用数据思维看待日常问题，发现生活中处处都有可以被量化的信息。', stampStatus: 'published', sortOrder: 3 },

      // 工程实践与深度研究
      { columnType: 'engineering', year: '2025', title: '第一个数据分析项目', contentMarkdown: '使用Python + Pandas + Matplotlib完成了第一个完整的数据分析项目，从数据清洗到可视化输出。虽然过程坎坷，但第一次看到自己生成的图表时，感受到了数据可视化的魅力。', stampStatus: 'published', sortOrder: 1 },
      { columnType: 'engineering', year: '2025', title: '智能计算方向探索', contentMarkdown: '开始深入学习机器学习基础算法，从线性回归到决策树，逐步理解模型训练的流程。在课程实践中尝试用Scikit-learn解决实际问题，对智能计算有了更直观的认识。', stampStatus: 'published', sortOrder: 2 },
      { columnType: 'engineering', year: '2025', title: '全栈开发入门', contentMarkdown: '为了更好地展示自己的项目和学习成果，开始学习Web开发。从HTML/CSS/JavaScript基础到Vue.js框架，再到Node.js后端，逐渐建立起全栈开发的知识体系。', stampStatus: 'published', sortOrder: 3 },

      // 开源宣言与基础设施编年
      { columnType: 'open-source', year: '2024', title: '拥抱开源文化', contentMarkdown: '加入学校技术社团后，第一次接触到GitHub和开源社区。学会了使用Git进行版本控制，理解了Pull Request、Code Review等协作流程，被开源社区的协作精神深深打动。', stampStatus: 'published', sortOrder: 1 },
      { columnType: 'open-source', year: '2025', title: 'Paper George 诞生', contentMarkdown: '受到报纸排版美学的启发，决定用代码打造一个报纸风格的个人作品集网站。融合了NestJS后端、Nuxt 3前端、Prisma ORM和PostgreSQL数据库，完整实践了全栈开发流程。', stampStatus: 'published', sortOrder: 2 },
      { columnType: 'open-source', year: '2025', title: '持续进步中', contentMarkdown: 'ENFJ人格驱动着我不断探索新领域。积极开朗的性格让我在团队协作中如鱼得水，充满好奇心则推动我持续学习。数据科学的道路还很长，但我一直在努力进步。', stampStatus: 'published', sortOrder: 3 },
    ],
  });

  // Projects - delete and recreate for idempotency
  await prisma.project.deleteMany();
  await prisma.project.createMany({
    data: [
      { title: 'Paper George 纪事报', description: '报纸风格的个人作品集与博客网站，融合了复古排版美学与现代Web技术。使用Nuxt 3 + NestJS + Prisma + PostgreSQL全栈开发，支持SSR渲染、JWT认证、文件上传等功能。', tags: ['Nuxt 3', 'NestJS', 'Prisma', 'PostgreSQL', 'TypeScript'], sortOrder: 1 },
      { title: '校园数据分析仪表盘', description: '基于Python的数据分析课程项目，对校园消费数据进行清洗、分析和可视化。使用Pandas处理数据，Matplotlib生成图表，直观展示学生消费行为模式。', tags: ['Python', 'Pandas', 'Matplotlib', '数据分析'], sortOrder: 2 },
      { title: '智能推荐系统原型', description: '课程实践项目，基于协同过滤算法实现简单的推荐系统原型。从数据预处理到模型训练，完整走通机器学习项目流程，深入理解推荐算法的工作原理。', tags: ['Python', 'Scikit-learn', '机器学习', '推荐系统'], sortOrder: 3 },
      { title: '班级信息管理平台', description: '团队协作开发的班级信息管理Web应用，支持学生信息录入、成绩查询、通知公告等功能。负责前端页面开发和数据库设计，锻炼了团队协作和项目管理能力。', tags: ['Vue.js', 'Node.js', 'MySQL', '团队协作'], sortOrder: 4 },
    ],
  });

  // Scraps - delete and recreate for idempotency
  await prisma.scrap.deleteMany();
  await prisma.scrap.createMany({
    data: [
      { title: '关于 George Mankind', content: '一个来自广东揭阳惠来的00后，现就读于广东财经大学数据科学与大数据技术（智能计算）专业。ENFJ人格，积极开朗，充满好奇心，始终相信努力进步的力量。\n\n生日：2006年8月8日\n坐标：广州 & 佛山', rotation: 1.5, sortOrder: 1 },
      { title: 'ENFJ 的一天', content: '早晨被闹钟叫醒，第一件事是看看技术社区有什么新动态。\n上课时认真听讲，下课后和同学讨论项目思路。\n晚上回到宿舍，打开VS Code开始写代码。\n虽然偶尔会遇到Bug，但解决问题的瞬间总是让人兴奋不已。\n\n这就是一个ENFJ数据科学学生的日常。', rotation: -0.8, sortOrder: 2 },
      { title: '惠来印象', content: '广东揭阳惠来，一个位于粤东南沿海的小城。\n这里有新鲜的海鲜，热情的乡亲，还有我童年的记忆。\n从惠来到广州，从海边到都市，每一步都是成长。\n\n家乡的味道，永远是最温暖的记忆。', rotation: 0.5, sortOrder: 3 },
      { title: '数据科学随想', content: '数据不仅仅是数字，它是故事的载体。\n每一个数据点背后，都有一个真实的世界。\n作为数据科学的学习者，我希望用数据讲述有意义的故事。\n\n从Python到机器学习，从分析到可视化，\n这条路上充满了挑战，但也充满了可能性。', rotation: -1.2, sortOrder: 4 },
    ],
  });

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
