import { PrismaClient } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const prisma = new PrismaClient();

// Reset database before each test
beforeEach(async () => {
  await prisma.user.deleteMany();
  await prisma.session.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.feedback.deleteMany();
});

// Disconnect after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };