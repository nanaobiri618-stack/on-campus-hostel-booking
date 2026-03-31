import { prisma } from '@/lib/prisma';
import { verifyJwt } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyJwt(token) as any;
    if (!payload || payload.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      ghanaCard,
      gpsAddress,
      hostelName,
      location,
      verifiedPrices,
      roomSize,
      utilities,
      ownerPhoto,
      idCardPhoto,
      facilitiesPhoto,
    } = body;

    // Basic validation
    if (!ghanaCard || !hostelName || !ownerPhoto) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        ghanaCard,
        gpsAddress,
        hostelName,
        location,
        verificationStatus: 'PENDING',
        verification: {
          upsert: {
            create: {
              ownerPhoto,
              idCardPhoto,
              facilitiesPhoto,
              utilities,
              roomSize,
              verifiedPrices,
            },
            update: {
              ownerPhoto,
              idCardPhoto,
              facilitiesPhoto,
              utilities,
              roomSize,
              verifiedPrices,
            }
          }
        }
      },
    });

    return NextResponse.json({ 
      message: 'Application submitted successfully',
      user: updatedUser 
    });
  } catch (error: any) {
    console.error('[OWNER_VERIFY_ERROR]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
