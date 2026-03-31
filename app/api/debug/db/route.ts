import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        HAS_DATABASE_URL: !!dbUrl,
        DATABASE_URL_START: dbUrl ? dbUrl.substring(0, 15) + '...' : 'MISSING',
      },
    };

    // Try a simple query
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: 'success',
      message: 'Database is reachable',
      db: debugInfo,
      count: userCount
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      code: error.code,
      db: {
        HAS_DATABASE_URL: !!process.env.DATABASE_URL,
        DATABASE_URL_START: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + '...' : 'MISSING',
      },
      error_details: {
        name: error.name,
        stack: error.stack?.split('\n')[0],
      }
    }, { status: 500 });
  }
}
