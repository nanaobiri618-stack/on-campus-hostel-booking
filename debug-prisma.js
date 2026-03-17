const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const dbUrl = new URL('mysql://root:Kwesiobiri@8@127.0.0.1:3306/oncampus_db');

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.slice(1),
  connectionLimit: 1,
});

const prisma = new PrismaClient({ adapter });

async function check() {
  console.log('Available models:', Object.keys(prisma).filter(k => !k.startsWith('_')));
  try {
    const count = await prisma.admin.count();
    console.log('Admin count:', count);
  } catch (err) {
    console.error('Error accessing admin:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
