import { NextResponse } from 'next/server';
import mockData from '@/data/mock-hostaway.json';
import { normalizeHostaway } from '@/lib/normalizeHostway';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') ?? '20', 10);
  const skip = (page - 1) * pageSize;

  const listingId = searchParams.get('listingId') || undefined;
  const approvedParam = searchParams.get('approved');
  const approved =
    approvedParam === undefined ? undefined : approvedParam === 'true';
  const minRating = searchParams.get('minRating')
    ? parseFloat(searchParams.get('minRating')!)
    : undefined;
  const maxRating = searchParams.get('maxRating')
    ? parseFloat(searchParams.get('maxRating')!)
    : undefined;
  const channel = searchParams.get('channel') || undefined;
  const category = searchParams.get('category') || undefined;

  const startDate = searchParams.get('startDate') || undefined;
  const endDate = searchParams.get('endDate') || undefined;

  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  interface ReviewWhere {
    listingId?: string;
    approved?: boolean;
    rating?: { gte?: number; lte?: number };
    channel?: string;
    categories?: { some: { category: string } };
    createdAt?: { gte?: Date; lte?: Date };
  }

  const where: ReviewWhere = {};
  if (listingId) where.listingId = listingId;
  if (approved !== undefined) where.approved = approved;

  if (minRating !== undefined || maxRating !== undefined) {
    where.rating = {};
    if (minRating !== undefined) where.rating.gte = minRating;
    if (maxRating !== undefined) where.rating.lte = maxRating;
  }

  if (channel) where.channel = channel;
  if (category) where.categories = { some: { category } };

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  type OrderBy = { rating?: 'asc' | 'desc'; createdAt?: 'asc' | 'desc'; listingName?: 'asc' | 'desc' };

  const orderBy: OrderBy = {};
  if (sortBy === 'rating') {
    orderBy.rating = sortOrder as 'asc' | 'desc';
  } else if (sortBy === 'createdAt') {
    orderBy.createdAt = sortOrder as 'asc' | 'desc';
  } else if (sortBy === 'listingName') {
    orderBy.listingName = sortOrder as 'asc' | 'desc';
  } else {
    orderBy.createdAt = 'desc'; // default
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: pageSize,
      include: { categories: true },
      orderBy,
    }),
    prisma.review.count({ where }),
  ]);

  if (total === 0) {
    const normalized = (Array.isArray(mockData) ? mockData : []).map(
      normalizeHostaway,
    );
    return NextResponse.json({
      page,
      pageSize,
      total: normalized.length,
      data: normalized.slice(skip, skip + pageSize),
    });
  }

  return NextResponse.json({
    page,
    pageSize,
    total,
    data: reviews.map((r) => ({
      ...r,
      categoryRatings: r.categories.map((c) => ({
        category: c.category,
        rating: c.rating,
      })),
    })),
  });
}
