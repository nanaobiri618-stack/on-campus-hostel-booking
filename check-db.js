const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');
require('dotenv').config();

async function test() {
  const adapter = new PrismaMariaDb({
    host: 'localhost',
    user: 'root',
    password: 'Kwesiobiri@8',
    database: 'oncampus_db',
    port: 3306,
    connectionLimit: 10,
    insertIdAsNumber: true,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('Testing connection with MariaDB adapter (direct config)...');
    const userCount = await prisma.user.count();
    console.log('Successfully connected! User count:', userCount);
    
    const columns = await prisma.$queryRaw`DESCRIBE user`;
    console.log('User Table structure verified.');
  } catch (err) {
    console.error('Connection failed:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
