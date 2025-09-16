import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, approved } = body as { id: string; approved: boolean };

    if (!id || typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing or invalid parameters' },
        { status: 400 },
      );
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { approved },
    });

    return NextResponse.json({ success: true, review: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to update approval status' },
      { status: 500 },
    );
  }
}
