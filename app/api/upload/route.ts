import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${randomUUID()}.${fileExtension}`;
    
    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Ignore if directory exists
    }

    const path = join(uploadDir, fileName);
    await writeFile(path, buffer);

    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error: any) {
    console.error('[UPLOAD_ERROR]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
