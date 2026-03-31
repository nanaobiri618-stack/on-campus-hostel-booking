import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { verifyJwt } from '@/lib/auth';

export async function PATCH(request: Request) {
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

    const { name, email, phone, businessName } = await request.json();
    console.log('Updating settings for user:', payload.userId, { name, email, phone, businessName });

    // Definitive fix: Use raw SQL for both update and fetch to bypass Prisma client DMMF issues
    await prisma.$executeRawUnsafe(
      `UPDATE user SET phone = ?, businessName = ?, name = ?, email = ? WHERE id = ?`,
      phone || null,
      businessName || null,
      name || null,
      email || null,
      payload.userId
    );

    // Fetch back using raw query to avoid "Unknown field" errors
    const users = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, name, email, phone, businessName, role FROM user WHERE id = ?`,
      payload.userId
    );
    
    const updatedUser = users[0];
    console.log('Successfully updated and fetched user:', updatedUser);

    return NextResponse.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('OWNER_SETTINGS_PATCH_ERROR:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
