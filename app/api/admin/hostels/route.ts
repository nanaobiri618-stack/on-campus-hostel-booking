import { prisma } from '@/lib/prisma';
import { verifyJwt } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

async function checkAdmin(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const payload = token ? (verifyJwt(token) as any) : null;
  return payload && payload.role === 'ADMIN';
}

// GET: Fetch all hostels
export async function GET(request: Request) {
  if (!(await checkAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const hostels = await prisma.hostel.findMany({
      include: {
        owner: { select: { name: true, email: true } },
        university: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(hostels);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update hostel
export async function PUT(request: Request) {
  if (!(await checkAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id, ...data } = await request.json();
    const updatedHostel = await prisma.hostel.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        price: data.price ? parseFloat(data.price) : undefined,
      },
    });
    return NextResponse.json(updatedHostel);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove hostel
export async function DELETE(request: Request) {
  if (!(await checkAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = await request.json();
    await prisma.hostel.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Hostel deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
