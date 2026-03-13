import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJwt } from '@/lib/auth';

// --- 1. GET: Fetch all hostels ---
export async function GET() {
  try {
    // Definitive fix: Use raw SQL with joins to bypass Prisma client runtime bugs
    const hostelsRaw = await prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        h.id, h.name, h.description, h.location, h.price, h.images, h.createdAt,
        u.id as uni_id, u.name as uni_name, u.location as uni_location,
        o.id as owner_id, o.name as owner_name, o.businessName as owner_businessName, o.phone as owner_phone
      FROM hostel h
      LEFT JOIN university u ON h.universityId = u.id
      LEFT JOIN user o ON h.ownerId = o.id
      ORDER BY h.createdAt DESC
    `);

    // Format the raw data into the nested structure the frontend expects
    const hostels = hostelsRaw.map(h => ({
      id: h.id,
      name: h.name,
      description: h.description,
      location: h.location,
      price: h.price,
      images: h.images,
      createdAt: h.createdAt,
      university: h.uni_id ? {
        id: h.uni_id,
        name: h.uni_name,
        location: h.uni_location
      } : null,
      owner: {
        id: h.owner_id,
        name: h.owner_name,
        businessName: h.owner_businessName,
        phone: h.owner_phone
      }
    }));

    return NextResponse.json(hostels);
  } catch (error: any) {
    console.error('Fetch Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch hostels',
      details: error.message 
    }, { status: 500 });
  }
}

// --- 2. POST: Create a new hostel ---
export async function POST(request: Request) {
  try {
    const cookie = request.headers.get('cookie');
    const token = cookie?.split('auth_token=')[1]?.split(';')[0];
    const payload = token ? (verifyJwt(token) as any) : null;

    if (!payload || payload.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    console.log('Creating hostel with body:', body);

    // Safeguard universityId
    const rawUniId = parseInt(body.universityId);
    const universityId = isNaN(rawUniId) ? undefined : rawUniId;

    const newHostel = await (prisma.hostel as any).create({
      data: {
        name: body.name,
        description: `Rooms: ${body.rooms || 'N/A'}. Location: ${body.location}`, 
        location: body.location,
        price: parseFloat(body.price),
        ownerId: payload.userId, 
        universityId: universityId,
        images: Array.isArray(body.images) ? body.images.join(',') : body.images,
      },
    });
    
    return NextResponse.json(newHostel, { status: 201 });
  } catch (error) {
    console.error('Create Error:', error);
    return NextResponse.json(
      { error: "Could not create hostel. Ensure all fields are valid." }, 
      { status: 500 }
    );
  }
}