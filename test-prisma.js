const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

async function test() {
  const adapter = new PrismaMariaDb({
    host: '127.0.0.1',
    user: 'root',
    password: 'Kwesiobiri@8',
    database: 'oncampus_db',
    port: 3306,
  });
  const prisma = new PrismaClient({ adapter });

  console.log('Available models:', Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));
  
  try {
    const unis = await prisma.university.findMany();
    console.log('Universities found:', unis.length);
  } catch (err) {
    console.error('Error accessing university:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
