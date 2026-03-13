const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const adapter = new PrismaMariaDb({
  host: '127.0.0.1',
  user: 'root',
  password: 'Kwesiobiri@8',
  database: 'oncampus_db',
  port: 3306,
  connectionLimit: 10
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Starting Comprehensive Database Seed ---');

  try {
    // 1. Create a Default Owner
    let owner = await prisma.user.upsert({
      where: { email: 'owner@hostelhub.com' },
      update: { role: 'OWNER', businessName: 'Premium Properties Ltd' },
      create: {
        email: 'owner@hostelhub.com',
        password: 'password123',
        role: 'OWNER',
        name: 'Hostel Administration',
        businessName: 'Premium Properties Ltd',
        phone: '0541234567'
      }
    });
    console.log('Owner created/found.');

    // 2. Comprehensive List of Ghanaian Universities
    const universitiesData = [
      { name: "University of Ghana", location: "Legon, Accra" },
      { name: "KNUST", location: "Kumasi" },
      { name: "University of Cape Coast (UCC)", location: "Cape Coast" },
      { name: "University of Education, Winneba (UEW)", location: "Winneba" },
      { name: "University for Development Studies (UDS)", location: "Tamale" },
      { name: "UPSA", location: "Accra" },
      { name: "GIMPA", location: "Accra" },
      { name: "Ashesi University", location: "Berekuso" },
      { name: "Central University", location: "Miotso" },
      { name: "Valley View University", location: "Oyibi" },
      { name: "University of Health and Allied Sciences (UHAS)", location: "Ho" },
      { name: "University of Mines and Technology (UMaT)", location: "Tarkwa" },
      { name: "University of Energy and Natural Resources (UENR)", location: "Sunyani" },
      { name: "Accra Technical University", location: "Accra" },
      { name: "Kumasi Technical University", location: "Kumasi" },
      { name: "Koforidua Technical University", location: "Koforidua" },
      { name: "Cape Coast Technical University", location: "Cape Coast" },
      { name: "Ho Technical University", location: "Ho" },
      { name: "Takoradi Technical University", location: "Takoradi" },
      { name: "Sunyani Technical University", location: "Sunyani" },
      { name: "Tamale Technical University", location: "Tamale" },
      { name: "Wa Technical University", location: "Wa" },
      { name: "Bolgatanga Technical University", location: "Bolgatanga" },
      { name: "Lancaster University Ghana", location: "East Legon, Accra" },
      { name: "Wisconsin International University College", location: "Accra" },
      { name: "All Nations University", location: "Koforidua" },
      { name: "Pentecost University", location: "Accra" },
      { name: "Methodist University", location: "Accra" },
      { name: "Presbyterian University", location: "Kwahu" },
      { name: "Academic City University College", location: "Haatso, Accra" }
    ];

    console.log(`Seeding ${universitiesData.length} universities...`);
    const universities = [];
    for (const u of universitiesData) {
      const university = await prisma.university.upsert({
        where: { name: u.name },
        update: { location: u.location },
        create: u
      });
      universities.push(university);
    }
    console.log('Universities seeded.');

    // Map names to IDs for easier access
    const uniMap = universities.reduce((acc, current) => {
      acc[current.name] = current.id;
      return acc;
    }, {});

    // 3. Create Sample Hostels
    const hostelsData = [
      {
        name: "University Gardens",
        description: "Premium student accommodation near Legon.",
        location: "Legon, Accra",
        price: 4500,
        images: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
        ownerId: owner.id,
        universityId: uniMap["University of Ghana"]
      },
      {
        name: "Classic Student Lodge",
        description: "Spacious rooms near KNUST.",
        location: "KNUST, Kumasi",
        price: 3200,
        images: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
        ownerId: owner.id,
        universityId: uniMap["KNUST"]
      },
      {
        name: "The Hub Residence",
        description: "Vibrant community near UCC.",
        location: "Cape Coast University",
        price: 2800,
        images: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
        ownerId: owner.id,
        universityId: uniMap["University of Cape Coast (UCC)"]
      },
      {
        name: "J", 
        description: "Modern facility for comfortable student living.",
        location: "Ghana",
        price: 2500,
        images: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
        ownerId: owner.id,
        universityId: uniMap["Accra Technical University"]
      }
    ];

    for (const h of hostelsData) {
      await prisma.hostel.upsert({
        where: { id: hostelsData.indexOf(h) + 1 }, // Just for seeding logic
        update: h,
        create: h
      }).catch(async () => {
        // Fallback if upsert by ID is tricky during initial seed
        await prisma.hostel.create({ data: h });
      });
    }

    console.log('--- Seed Completed Successfully ---');
  } catch (err) {
    console.error('SEED ERROR:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
