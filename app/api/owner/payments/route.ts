import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get('cookie');
    const token = cookie?.split('auth_token=')[1]?.split(';')[0];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyJwt(token) as any;
    if (!payload || payload.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const ownerHostels = await prisma.hostel.findMany({
      where: { ownerId: payload.userId },
      select: { id: true }
    });

    const hostelIds = ownerHostels.map((h: any) => h.id);

    if (hostelIds.length === 0) {
      return NextResponse.json({ payments: [] });
    }

    const bookings = await (prisma as any).booking.findMany({
      where: {
        hostelId: { in: hostelIds },
        status: { in: ['PAID', 'VERIFIED'] }
      },
      include: {
        student: { select: { name: true } },
        hostel: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedPayments = bookings.map((b: any) => ({
      id: b.id,
      student: b.student.name,
      hostel: b.hostel.name,
      amount: b.amount,
      method: b.telecom || 'Unknown',
      status: b.status === 'VERIFIED' ? 'Success' : 'Pending Verification',
      date: b.createdAt.toISOString().split('T')[0]
    }));

    return NextResponse.json({ payments: formattedPayments });
  } catch (error) {
    console.error('OWNER_PAYMENTS_ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
