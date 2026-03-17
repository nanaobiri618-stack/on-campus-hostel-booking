import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signJwt } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // --- MANTATORY ADMIN LOGIN OVERRIDE ---
    if (email.toLowerCase() === 'admingod@gmail.com' && password === 'GODad_2026') {
      console.log('[LOGIN] Hardcoded Admin access granted');
      const adminToken = signJwt({
        userId: 0, // Special ID for hardcoded admin
        role: 'ADMIN',
        isVerified: true
      });

      const response = NextResponse.json({
        message: 'Admin login successful',
        user: {
          id: 0,
          email: 'admingod@gmail.com',
          name: 'GODappAD',
          role: 'ADMIN',
          isVerified: true,
          createdAt: new Date().toISOString()
        }
      }, { status: 200 });

      response.cookies.set('auth_token', adminToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      return response;
    }
    // --------------------------------------

    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true, password: true, name: true, role: true, isVerified: true, createdAt: true },
    });

    let isAdmin = false;

    // If not found in User, check Admin table (check by email or username)
    if (!user) {
      const p = prisma as any;
      const adminModel = p.admin || p.Admin;

      if (!adminModel) {
        console.error('[LOGIN] Prisma Admin model not found. Available:', Object.keys(p).filter(k => !k.startsWith('_')));
        throw new Error('Database schema out of sync. Please restart the server.');
      }

      const admin = await adminModel.findFirst({
        where: {
          OR: [
            { email: email.toLowerCase() },
            { username: email } // 'email' field in request might be username
          ]
        }
      });

      if (admin) {
        user = {
          id: admin.id,
          email: admin.email,
          password: admin.password,
          name: admin.username,
          role: 'ADMIN' as any,
          isVerified: true,
          createdAt: admin.createdAt
        };
        isAdmin = true;
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const { password: _pw, ...safeUser } = user;
    const token = signJwt({ userId: user.id, role: user.role, isVerified: user.isVerified });

    const response = NextResponse.json({ message: 'Login successful', user: safeUser }, { status: 200 });

    // Set HTTP-only cookie - secure false to allow both HTTP and HTTPS
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: false, // Allow both HTTP and HTTPS for deployment flexibility
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('LOGIN_ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}