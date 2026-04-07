import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJwt } from '@/lib/auth';

export const dynamic = 'force-dynamic';

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
    // 1. Check Auth First (before reading potentially massive body)
    const cookie = request.headers.get('cookie') || "";
    const tokenMatch = cookie.match(/auth_token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    const payload = token ? (verifyJwt(token) as any) : null;

    if (!payload || payload.role !== 'OWNER') {
      console.warn('[API/Hostels] Unauthorized attempt or invalid token');
      return NextResponse.json({ error: 'Unauthorized. Please log in as an owner.' }, { status: 403 });
    }

    // 2. Read JSON body with error handling
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('[API/Hostels] Body parsing failed:', parseError);
      return NextResponse.json({ 
        error: 'Failed to read data. The images might be too large for the server. Try uploading fewer images.' 
      }, { status: 413 });
    }

    console.log('[API/Hostels] POST request received from user:', payload.userId);

    // Safeguard universityId
    const rawUniId = parseInt(body.universityId);
    const universityId = isNaN(rawUniId) ? undefined : rawUniId;

    const newHostel = await (prisma.hostel as any).create({
      data: {
        name: body.name,
        description: body.description || `Rooms: ${body.rooms || 'N/A'}. Location: ${body.location}`, 
        location: body.location,
        price: parseFloat(body.price),
        ownerId: payload.userId, 
        universityId: universityId,
        gender: body.gender || "MIXED",
        images: Array.isArray(body.images) 
          ? body.images.filter((url: string) => url.trim() !== "").join('|DELIM|') 
          : body.images,
      },
    });

    // Auto-sync owner info
    await prisma.user.update({
      where: { id: payload.userId },
      data: {
        hostelName: body.name,
        location: body.location,
        businessName: body.name, // Use hostel name as business name if not set
      }
    });
    
    return NextResponse.json(newHostel, { status: 201 });
  } catch (error: any) {
    console.error('[API/Hostels] Create Error:', error);
    return NextResponse.json(
      { error: "Could not create hostel. " + (error.message || "Ensure all fields are valid.") }, 
      { status: 500 }
    );
  }
}