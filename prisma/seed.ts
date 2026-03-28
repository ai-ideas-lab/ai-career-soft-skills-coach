import { PrismaClient } from '@prisma/client';
import { categories, scenarios, dialogues, questions, options } from './data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@aiideaslab.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi.', // password
      name: 'Admin User',
    },
  });

  // Create categories
  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  // Create scenarios
  for (const scenario of scenarios) {
    await prisma.scenario.create({
      data: {
        ...scenario,
        dialogues: {
          create: dialogues.filter(d => d.scenarioId === scenario.id),
        },
        questions: {
          create: questions
            .filter(q => q.scenarioId === scenario.id)
            .map(q => ({
              ...q,
              options: {
                create: options.filter(o => o.questionId === q.id),
              },
            })),
        },
      },
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });