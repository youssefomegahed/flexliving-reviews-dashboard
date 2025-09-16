export type CategoryRating = {
  category: string;
  rating: number;
};

export type Review = {
  id: string;
  source: string;
  sourceReviewId: string;
  listingId: string;
  listingName?: string;
  channel?: string;
  reviewType?: string;
  status: string;
  rating: number | null;
  text: string;
  authorName?: string;
  createdAt: string;
  approved: boolean;
  categoryRatings: CategoryRating[];
};
