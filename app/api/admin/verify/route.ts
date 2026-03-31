import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { verifyJwt } from '@/lib/auth';

export async function POST(request: Request) {
  const cookie = request.headers.get('cookie');
  const token = cookie?.split('auth_token=')[1]?.split(';')[0];
  const payload = token ? (verifyJwt(token) as any) : null;

  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { userId, notes, status } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: status === 'VERIFIED',
        verificationStatus: status,
        verificationNotes: notes,
      },
    });

    return NextResponse.json({ 
      message: `User ${status === 'VERIFIED' ? 'verified' : 'updated'} successfully`,
      user: updatedUser 
    });
  } catch (error: any) {
    console.error('VERIFY_ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
