import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { fileName, mimeType, fileSize } = await request.json();
    const key = `vault/${Date.now()}-${fileName.replace(/\s+/g, '_')}`;

    return NextResponse.json({
      uploadUrl: `https://mock-s3-upload.local/${key}`,
      storageKey: key,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
