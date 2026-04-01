import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
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

    const owner = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { verification: true }
    });

    if (!owner) {
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
    }

    const ownerHostels = await prisma.hostel.findMany({
      where: { ownerId: payload.userId },
      select: { id: true }
    });

    const hostelIds = ownerHostels.map((h: any) => h.id);

    if (hostelIds.length === 0) {
      return NextResponse.json({ 
        students: [], 
        stats: { total: 0, verified: 0, paid: 0, applied: 0, pending: 0 } 
      });
    }

    // 2. Find all formal bookings for these hostels
    // This includes students who have APPLIED, PAID, or been VERIFIED
    const bookings = await (prisma as any).booking.findMany({
      where: {
        hostelId: { in: hostelIds }
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            uniqueNumber: true,
            schoolName: true,
            phone: true,
            roomNumber: true
          }
        },
        hostel: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 3. Format the data for the frontend
    const formattedStudents = bookings.map((b: any) => ({
      id: b.student.id,
      name: b.student.name,
      email: b.student.email,
      uniqueNumber: b.student.uniqueNumber,
      schoolName: b.student.schoolName,
      phone: b.student.phone,
      roomNumber: b.student.roomNumber,
      bookingId: b.id,
      hostelName: b.hostel.name,
      verificationId: b.verificationId,
      paymentPhone: b.paymentPhone,
      telecom: b.telecom,
      amount: b.amount,
      createdAt: b.createdAt,
      status: b.status // APPLIED, PAID, VERIFIED
    }));

    // 4. Calculate stats
    const stats = {
      total: formattedStudents.length,
      verified: formattedStudents.filter((s: any) => s.status === 'VERIFIED').length,
      paid: formattedStudents.filter((s: any) => s.status === 'PAID').length,
      applied: formattedStudents.filter((s: any) => s.status === 'APPLIED').length,
      pending: formattedStudents.filter((s: any) => s.status !== 'VERIFIED').length
    };

    return NextResponse.json({ 
      students: formattedStudents, 
      stats,
      userStatus: owner.verificationStatus 
    });
  } catch (error) {
    console.error('OWNER_STUDENTS_ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
