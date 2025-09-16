import { prisma } from '../src/lib/prisma';
import mockData from '../src/data/mock-hostaway.json';
import { normalizeHostaway } from '../src/lib/normalizeHostway';

async function main() {
  const normalized = (mockData ?? []).map(normalizeHostaway);

  for (const r of normalized) {
    await prisma.review.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        source: r.source,
        sourceReviewId: r.sourceReviewId,
        listingId: r.listingId,
        listingName: r.listingName,
        channel: r.channel,
        reviewType: r.reviewType,
        status: r.status,
        rating: r.rating,
        text: r.text,
        authorName: r.authorName,
        createdAt: new Date(r.createdAt),
        categories: {
          create: r.categoryRatings.map((c) => ({
            category: c.category,
            rating: c.rating,
          })),
        },
      },
    });
  }

  console.log('Seed complete');
}

main().finally(() => prisma.$disconnect());
