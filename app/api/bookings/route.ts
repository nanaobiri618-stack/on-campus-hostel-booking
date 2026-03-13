import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJwt } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const cookie = request.headers.get('cookie');
    const token = cookie?.split('auth_token=')[1]?.split(';')[0];
    const payload = token ? (verifyJwt(token) as any) : null;

    if (!payload || payload.role !== 'TENANT') {
      return NextResponse.json({ error: 'Unauthorized. Please login as a student.' }, { status: 401 });
    }

    const body = await request.json();
    const { hostelId, amount, paymentPhone, telecom, verificationId } = body;

    if (!hostelId || !amount || !paymentPhone || !telecom || !verificationId) {
      return NextResponse.json({ error: 'Missing booking details.' }, { status: 400 });
    }

    const hId = parseInt(hostelId);

    // Relational Sync: Transition existing APPLIED booking to PAID or create new
    const existingBooking = await (prisma as any).booking.findFirst({
      where: {
        studentId: payload.userId,
        hostelId: hId,
        status: 'APPLIED'
      }
    });

    let booking;
    if (existingBooking) {
      booking = await (prisma as any).booking.update({
        where: { id: existingBooking.id },
        data: {
          amount: parseFloat(amount),
          paymentPhone,
          telecom,
          verificationId,
          status: 'PAID'
        }
      });
    } else {
      booking = await (prisma as any).booking.create({
        data: {
          studentId: payload.userId,
          hostelId: hId,
          amount: parseFloat(amount),
          paymentPhone,
          telecom,
          verificationId,
          status: 'PAID'
        }
      });
    }

    console.log('Booking status updated to PAID:', booking.id);
    return NextResponse.json({ message: 'Booking confirmed!', booking }, { status: 201 });
  } catch (error: any) {
    console.error('BOOKING_CREATE_ERROR:', error);
    return NextResponse.json({ error: 'Failed to process booking', details: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get('cookie');
    const token = cookie?.split('auth_token=')[1]?.split(';')[0];
    const payload = token ? (verifyJwt(token) as any) : null;

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let bookings;
    if (payload.role === 'TENANT') {
      bookings = await (prisma as any).booking.findMany({
        where: { studentId: payload.userId },
        include: { hostel: true },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      bookings = await (prisma as any).booking.findMany({
        where: { hostel: { ownerId: payload.userId } },
        include: { student: true, hostel: true },
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('BOOKINGS_FETCH_ERROR:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
