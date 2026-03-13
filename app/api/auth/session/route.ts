import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyJwt, signJwt } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get('cookie');
    const token = cookie?.split('auth_token=')[1]?.split(';')[0];

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const payload = verifyJwt(token) as any;
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true, isVerified: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the verification status has changed since the token was issued
    const response = NextResponse.json({ user });

    if (user.isVerified !== payload.isVerified) {
      // Re-issue a new token with updated status
      const newToken = signJwt({ userId: user.id, role: user.role, isVerified: user.isVerified });
      response.cookies.set('auth_token', newToken, {
        httpOnly: true,
        secure: false, // Allow both HTTP and HTTPS for deployment flexibility
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('SESSION_ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
