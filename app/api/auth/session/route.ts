import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { verifyJwt, signJwt } from '@/lib/auth';

import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const payload = verifyJwt(token) as any;
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // --- MANTATORY ADMIN SESSION OVERRIDE ---
    if (payload.userId === 0 && payload.role === 'ADMIN') {
      return NextResponse.json({
        user: {
          id: 0,
          email: 'admingod@gmail.com',
          name: 'GODappAD',
          role: 'ADMIN',
          isVerified: true
        }
      });
    }

    let user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true, isVerified: true },
    }) as any;

    console.log(`[SESSION] User ${payload.userId} isVerified from DB:`, user?.isVerified);

    if (!user && payload.role === 'ADMIN') {
      const p = prisma as any;
      const adminModel = p.admin || p.Admin;
      
      if (adminModel) {
        const admin = await adminModel.findUnique({
          where: { id: payload.userId },
          select: { id: true, email: true, username: true, createdAt: true },
        });

        if (admin) {
          user = {
            id: admin.id,
            email: admin.email,
            name: admin.username,
            role: 'ADMIN',
            isVerified: true
          };
        }
      }
    }

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
