import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { verifyJwt } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const cookie = request.headers.get('cookie');
    const token = cookie?.split('auth_token=')[1]?.split(';')[0];
    const payload = token ? (verifyJwt(token) as any) : null;

    if (!payload || payload.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id, roomNumber } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    // Update the booking for this student at one of the owner's hostels
    const ownerHostels = await prisma.hostel.findMany({
      where: { ownerId: payload.userId },
      select: { id: true }
    });
    const hostelIds = ownerHostels.map(h => h.id);

    // Find the first booking to get the hostel name for the user record
    const firstBooking = await (prisma as any).booking.findFirst({
      where: {
        studentId: id,
        hostelId: { in: hostelIds },
        status: { in: ['PAID', 'APPLIED'] }
      },
      include: { hostel: true }
    });

    if (!firstBooking) {
      return NextResponse.json({ error: 'No pending booking found for this student' }, { status: 404 });
    }

    await (prisma as any).booking.updateMany({
      where: {
        studentId: id,
        hostelId: { in: hostelIds },
        status: { in: ['PAID', 'APPLIED'] }
      },
      data: { status: 'VERIFIED' }
    });

    // Also update the user's verified status and assign room/hostel
    await prisma.user.update({
      where: { id },
      data: { 
        isVerified: true,
        roomNumber: roomNumber || undefined,
        hostelName: firstBooking.hostel.name
      }
    });

    return NextResponse.json({ message: 'Payment verified successfully' });
  } catch (error) {
    console.error('VERIFY_ERROR:', error);
    return NextResponse.json({ error: 'Student not found or verification failed' }, { status: 404 });
  }
}
