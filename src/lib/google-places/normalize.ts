import type { Review } from '@/types/review';
import type { GooglePlace, GoogleReview } from './types';

export function normalizeGooglePlaces(place: GooglePlace): Review[] {
  if (!place.reviews || !Array.isArray(place.reviews)) {
    return [];
  }

  return place.reviews.map((review, index) => {
    // Generate a unique ID for each review
    const reviewId = `google:${place.place_id}:${review.time}:${index}`;

    // Convert timestamp to ISO string
    const createdAt = new Date(review.time * 1000).toISOString();

    // Map Google Places rating (1-5) to our rating system
    const rating = review.rating;

    // Extract listing ID from place_id (simplified mapping)
    const listingId = place.place_id.replace('ChIJ', '').toLowerCase();

    // Create category ratings based on review content analysis
    const categoryRatings = generateCategoryRatings(review.text, rating);

    return {
      id: reviewId,
      source: 'google',
      sourceReviewId: `${place.place_id}:${review.time}`,
      listingId: listingId,
      listingName: place.name,
      channel: 'google',
      reviewType: 'guest-to-host',
      status: 'unpublished', // Default to unpublished, can be approved by managers
      rating: rating,
      text: review.text,
      authorName: review.author_name,
      createdAt: createdAt,
      categoryRatings: categoryRatings,
    };
  });
}

function generateCategoryRatings(
  reviewText: string,
  overallRating: number,
): Array<{ category: string; rating: number }> {
  const categories = [
    'cleanliness',
    'communication',
    'respect_house_rules',
    'check-in',
    'accuracy',
    'location',
    'value',
  ];

  const text = reviewText.toLowerCase();

  // Simple keyword-based category rating generation
  const categoryRatings = categories.map((category) => {
    let categoryRating = overallRating; // Start with overall rating

    // Adjust based on keywords in the review text
    switch (category) {
      case 'cleanliness':
        if (
          text.includes('clean') ||
          text.includes('spotless') ||
          text.includes('immaculate')
        ) {
          categoryRating = Math.min(5, overallRating + 0.5);
        } else if (
          text.includes('dirty') ||
          text.includes('messy') ||
          text.includes('unclean')
        ) {
          categoryRating = Math.max(1, overallRating - 1);
        }
        break;

      case 'communication':
        if (
          text.includes('responsive') ||
          text.includes('helpful') ||
          text.includes('accommodating')
        ) {
          categoryRating = Math.min(5, overallRating + 0.5);
        } else if (
          text.includes('unresponsive') ||
          text.includes('poor communication')
        ) {
          categoryRating = Math.max(1, overallRating - 1);
        }
        break;

      case 'location':
        if (
          text.includes('perfect location') ||
          text.includes('great location') ||
          text.includes('convenient')
        ) {
          categoryRating = Math.min(5, overallRating + 0.5);
        } else if (
          text.includes('noisy') ||
          text.includes('far from') ||
          text.includes('inconvenient')
        ) {
          categoryRating = Math.max(1, overallRating - 0.5);
        }
        break;

      case 'value':
        if (
          text.includes('great value') ||
          text.includes('worth it') ||
          text.includes('affordable')
        ) {
          categoryRating = Math.min(5, overallRating + 0.5);
        } else if (
          text.includes('expensive') ||
          text.includes('overpriced') ||
          text.includes('not worth')
        ) {
          categoryRating = Math.max(1, overallRating - 1);
        }
        break;

      case 'accuracy':
        if (
          text.includes('exactly as described') ||
          text.includes('accurate') ||
          text.includes('as advertised')
        ) {
          categoryRating = Math.min(5, overallRating + 0.5);
        } else if (
          text.includes('not as described') ||
          text.includes('misleading') ||
          text.includes('different from')
        ) {
          categoryRating = Math.max(1, overallRating - 1);
        }
        break;

      case 'check-in':
        if (
          text.includes('smooth check-in') ||
          text.includes('easy check-in') ||
          text.includes('seamless')
        ) {
          categoryRating = Math.min(5, overallRating + 0.5);
        } else if (
          text.includes('difficult check-in') ||
          text.includes('check-in problems')
        ) {
          categoryRating = Math.max(1, overallRating - 1);
        }
        break;

      case 'respect_house_rules':
        // Default to overall rating for this category
        break;
    }

    return {
      category: category,
      rating: Math.round(categoryRating * 10) / 10, // Round to 1 decimal place
    };
  });

  return categoryRatings;
}

export function normalizeAllGooglePlaces(places: GooglePlace[]): Review[] {
  const allReviews: Review[] = [];

  for (const place of places) {
    const normalizedReviews = normalizeGooglePlaces(place);
    allReviews.push(...normalizedReviews);
  }

  return allReviews;
}
