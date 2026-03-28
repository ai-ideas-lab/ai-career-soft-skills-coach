import { PrismaClient } from '@prisma/client';
import { scenarios } from './data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Check if admin user exists, create if not
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@aiideaslab.com' }
    });
    
    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          email: 'admin@aiideaslab.com',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi.', // password
          name: 'Admin User',
        },
      });
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.log('⚠️  Could not create admin user:', error.message);
  }

  // Create scenarios
  for (const scenario of scenarios) {
    try {
      await prisma.scenario.create({
        data: scenario,
      });
      console.log(`✅ Created scenario: ${scenario.title}`);
    } catch (error) {
      console.log(`⚠️  Could not create scenario ${scenario.title}:`, error.message);
    }
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