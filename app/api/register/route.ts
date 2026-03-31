import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { 
      email, 
      password, 
      name, 
      role, 
      uniqueNumber, 
      schoolName, 
      hostelName, 
      roomNumber, 
      location 
    } = await request.json();

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();
    const hashed = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: normalizedEmail,
          password: hashed,
          name: typeof name === 'string' ? name.trim() : null,
          role: role === 'OWNER' ? 'OWNER' : 'TENANT',
          uniqueNumber: uniqueNumber || null,
          schoolName: schoolName || null,
          hostelName: hostelName || null,
          roomNumber: roomNumber || null,
          location: location || null,
        },
      });

      // Relational Sync: Create initial booking application if student selected a hostel
      if (newUser.role === 'TENANT' && hostelName) {
        const hostel = await tx.hostel.findFirst({
          where: { name: hostelName }
        });

        if (hostel) {
          await (tx as any).booking.create({
            data: {
              studentId: newUser.id,
              hostelId: hostel.id,
              amount: hostel.price,
              status: 'APPLIED'
            }
          });
        }
      }

      return newUser;
    });

    return NextResponse.json({
      id: result.id,
      email: result.email,
      name: result.name,
      role: result.role,
      createdAt: result.createdAt
    }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'A user with this email or unique ID already exists' }, { status: 409 });
    }
    console.error('SIGNUP_ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}