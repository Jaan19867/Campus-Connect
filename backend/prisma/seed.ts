import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Delete existing admin users first
  await prisma.placementCell.deleteMany({});
  console.log('Deleted existing admin users');

  // Create new admin user with your credentials
  const hashedPassword = await bcrypt.hash('123456', 10);

  const admin = await prisma.placementCell.create({
    data: {
      email: 'mustafamustafa9891@gmail.com',
      password: hashedPassword,
      firstName: 'Rizabul',
      lastName: 'Admin',
      isActive: true,
    },
  });

  console.log('New admin user created:', admin);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });