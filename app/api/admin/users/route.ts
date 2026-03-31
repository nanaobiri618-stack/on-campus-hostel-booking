import { prisma } from '@/lib/prisma';
import { verifyJwt } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Helper to check for Admin role
async function checkAdmin(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const payload = token ? (verifyJwt(token) as any) : null;
  console.log('[ADMIN_CHECK] Cookie Token Found:', !!token);
  console.log('[ADMIN_CHECK] Payload:', payload);
  return payload && payload.role === 'ADMIN';
}

// GET: Fetch all users
export async function GET(request: Request) {
  if (!(await checkAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Runtime field verification
  try {
    const fields = Object.keys((prisma as any).user.fields || {});
    console.log('[API_RUNTIME_CHECK] User Fields:', fields);
  } catch (e) {}

  try {
    const users = await prisma.user.findMany({
      include: { verification: true },
      orderBy: { createdAt: 'desc' },
    });
    
    // Log available fields in the first result to see what's actually coming back
    if (users.length > 0) {
      const keys = Object.keys(users[0]);
      console.log('[API_DEBUG] Users fetched successfully. Count:', users.length);
      console.log('[API_DEBUG] Available keys in first record:', keys);
      
      // Check for specific fields
      ['gpsAddress', 'ghanaCard', 'legalDocs', 'verificationNotes'].forEach(f => {
        if (!(f in users[0])) {
          console.warn(`[API_DEBUG] FIELD MISSING FROM RUNTIME OBJECT: ${f}`);
        }
      });
    }

    return NextResponse.json(users);
  } catch (error: any) {
    console.error('[ADMIN_USERS_GET_FATAL]:', error);
    // Print the full stack to see where the "Unknown field" is coming from
    console.error(error.stack);
    return NextResponse.json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// PUT: Update user
export async function PUT(request: Request) {
  if (!(await checkAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id, ...data } = await request.json();
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data,
    });
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove user
export async function DELETE(request: Request) {
  if (!(await checkAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = await request.json();
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
