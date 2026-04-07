import { prisma } from '@/lib/prisma';
import { verifyJwt } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyJwt(token) as any;
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        bookings: {
          where: { status: 'VERIFIED' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check for expiry
    const activeBooking = user.bookings[0];
    if (activeBooking && activeBooking.expiresAt && new Date() > new Date(activeBooking.expiresAt)) {
      // Stay expired! Remove resident status
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: false,
          hostelName: null,
          roomNumber: null
        }
      });
      // Refresh user object for response
      user.isVerified = false;
      user.hostelName = null;
      user.roomNumber = null;
    }

    const { bookings, ...userProfile } = user;
    return NextResponse.json({
      ...userProfile,
      expiresAt: activeBooking?.expiresAt || null,
      durationMonths: activeBooking?.durationMonths || null
    });
  } catch (error: any) {
    console.error('[PROFILE_API_ERROR]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
