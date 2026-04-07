/**
 * Run this once to create the admin account:
 *   node prisma/create-admin.js
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@campuscash.tn';
  const password = 'Admin@2026!';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('✅ Admin account already exists:', email);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email,
      password: hashed,
      role: 'admin',
    }
  });

  console.log('✅ Admin account created!');
  console.log('   Email   :', admin.email);
  console.log('   Password:', password);
  console.log('   ID      :', admin.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
