import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const p = prisma as any;
    if (!p.university) {
      console.error('CRITICAL: university model missing. Keys:', Object.keys(p).filter(k => !k.startsWith('_')));
      return NextResponse.json({ 
        error: "Structural error", 
        details: "University model is missing in prisma client. Re-run prisma generate." 
      }, { status: 500 });
    }

    const universities = await p.university.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(universities);
  } catch (error: any) {
    console.error('Fetch Universities Error:', error);
    return NextResponse.json({ 
      error: "Could not fetch universities.",
      details: error.message 
    }, { status: 500 });
  }
}
