import { NextResponse } from 'next/server';
import mockData from '@/data/mock-hostaway.json';
import { normalizeHostaway } from '@/lib/normalizeHostway';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get('listingId');
  const approved = searchParams.get('approved');

  const reviewsFromDb = await prisma.review.findMany({
    where: {
      ...(listingId ? { listingId } : {}),
      ...(approved ? { approved: approved === 'true' } : {}),
    },
    include: { categories: true },
  });

  if (reviewsFromDb.length > 0) {
    return NextResponse.json({
      data: reviewsFromDb.map((r) => ({
        ...r,
        categoryRatings: r.categories.map((c) => ({
          category: c.category,
          rating: c.rating,
        })),
      })),
    });
  }

  const normalized = (mockData ?? []).map(normalizeHostaway);
  return NextResponse.json({ data: normalized });
}
