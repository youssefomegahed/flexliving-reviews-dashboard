"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeHostaway = normalizeHostaway;
function to5Scale(n) {
    if (n == null)
        return null;
    return Math.round((n / 2) * 10) / 10; // convert 0–10 → 0–5, keep one decimal
}
function normalizeHostaway(raw) {
    const categories = raw.reviewCategory?.map((c) => ({
        category: c.category,
        rating: to5Scale(c.rating) ?? 0,
    })) ?? [];
    const avg = raw.rating != null
        ? to5Scale(raw.rating)
        : categories.length
            ? Math.round((categories.reduce((a, b) => a + b.rating, 0) /
                categories.length) *
                10) / 10
            : null;
    return {
        id: `hostaway:${raw.id}`,
        source: 'hostaway',
        sourceReviewId: String(raw.id),
        listingId: raw.listingName
            ? raw.listingName.replace(/\s+/g, '-').toLowerCase()
            : 'unknown',
        listingName: raw.listingName,
        channel: raw.channel ?? 'unknown',
        reviewType: raw.type ?? null,
        status: raw.status ?? 'published',
        rating: avg,
        categoryRatings: categories,
        text: raw.publicReview ?? '',
        authorName: raw.guestName ?? '',
        createdAt: new Date(raw.submittedAt).toISOString(),
    };
}
