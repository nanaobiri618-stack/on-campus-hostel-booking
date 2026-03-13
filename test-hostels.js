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

  try {
    const hostels = await prisma.hostel.findMany({
      include: {
        owner: {
          select: {
            name: true,
            businessName: true,
            phone: true
          }
        },
        university: true
      }
    });
    console.log('Hostels found:', hostels.length);
    if (hostels.length > 0) {
      console.log('First hostel owner:', hostels[0].owner);
    }
  } catch (err) {
    console.error('Error fetching hostels:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
