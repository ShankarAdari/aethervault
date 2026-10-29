import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Server-side in-memory document store simulation for local dev
let serverDocuments: any[] = [];

export async function GET() {
  return NextResponse.json({
    documents: serverDocuments,
  });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const existingIndex = serverDocuments.findIndex((d) => d.id === payload.id);

    if (existingIndex >= 0) {
      serverDocuments[existingIndex] = {
        ...serverDocuments[existingIndex],
        ...payload,
        updatedAt: new Date().toISOString(),
      };
    } else {
      serverDocuments.push({
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      document: payload,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    serverDocuments = serverDocuments.filter((d) => d.id !== id);
  }
  return NextResponse.json({ success: true });
}
