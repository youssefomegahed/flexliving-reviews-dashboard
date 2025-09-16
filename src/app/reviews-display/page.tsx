'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useReviews } from '@/hooks/useReviews';
import type {
  ReviewFilters,
  SortOptions,
  PaginationParams,
} from '@/hooks/useReviews';
import type { Review } from '@/types/review';

export default function ReviewsDisplayPage() {
  // Default to showing only approved reviews
  const [filters] = useState<ReviewFilters>({ approved: true });
  const [sort, setSort] = useState<SortOptions>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 12,
  });

  // Fetch paginated reviews (only approved by default)
  const {
    data: reviewsResponse,
    isLoading,
    error,
  } = useReviews(filters, pagination, sort);
  const reviews = reviewsResponse?.data || [];

  const handleSortChange = (newSort: SortOptions) => {
    setSort(newSort);
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination({ ...pagination, pageSize, page: 1 });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flexPrimary mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error loading reviews
          </h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-flexPrimary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <Link
                href="/"
                className="hover:text-flexPrimary transition-colors"
              >
                Dashboard
              </Link>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-flexPrimary font-medium">
                Approved Reviews
              </span>
            </nav>

            {/* Page Title */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-flexPrimary">
                  Approved Reviews
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                  Browse through all approved guest reviews
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-flexPrimary/10 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-flexPrimary">
                    {reviewsResponse?.total || 0} reviews
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-flexPrimary">
                Reviews
              </h2>
            </div>

            {/* Sorting Controls */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-flexPrimary">
                Sort by:
              </label>
              <select
                value={sort.sortBy || 'createdAt'}
                onChange={(e) =>
                  handleSortChange({
                    ...sort,
                    sortBy: e.target.value as
                      | 'createdAt'
                      | 'rating'
                      | 'listingName',
                  })
                }
                className="px-3 py-2 border border-flexPrimary/30 rounded-lg focus:ring-2 focus:ring-flexPrimary focus:border-flexPrimary text-sm bg-white"
              >
                <option value="createdAt">Date</option>
                <option value="rating">Rating</option>
                <option value="listingName">Property Name</option>
              </select>
              <select
                value={sort.sortOrder || 'desc'}
                onChange={(e) =>
                  handleSortChange({
                    ...sort,
                    sortOrder: e.target.value as 'asc' | 'desc',
                  })
                }
                className="px-3 py-2 border border-flexPrimary/30 rounded-lg focus:ring-2 focus:ring-flexPrimary focus:border-flexPrimary text-sm bg-white"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-flexPrimary mb-2">
              No approved reviews found
            </h3>
            <p className="text-gray-600">
              There are no approved reviews to display at the moment.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={reviewsResponse?.page || 1}
              totalPages={reviewsResponse?.totalPages || 1}
              totalItems={reviewsResponse?.total || 0}
              pageSize={pagination.pageSize || 12}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </main>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-flexPrimary/20 p-6 hover:shadow-xl hover:border-flexPrimary/40 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-flexPrimary text-lg mb-1">
            {review.listingName || 'Property Review'}
          </h3>
          <p className="text-sm text-gray-600">{review.authorName}</p>
        </div>
        <div className="flex items-center space-x-1">
          {review.rating && (
            <>
              <span className="text-yellow-500">⭐</span>
              <span className="font-medium text-flexPrimary">
                {review.rating}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
        {review.text}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-flexPrimary/10 text-flexPrimary font-medium">
            {review.channel || 'Unknown'}
          </span>
        </div>
        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

// Pagination Component
function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="text-sm text-flexPrimary font-medium">
        Showing {startItem} to {endItem} of {totalItems} reviews
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-flexPrimary font-medium">Show:</label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1 border border-flexPrimary/30 rounded text-sm focus:ring-2 focus:ring-flexPrimary focus:border-flexPrimary"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-flexPrimary/30 rounded hover:bg-flexPrimary/10 hover:border-flexPrimary disabled:opacity-50 disabled:cursor-not-allowed text-flexPrimary font-medium transition-colors"
          >
            Previous
          </button>

          <span className="px-3 py-1 text-sm text-flexPrimary font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-flexPrimary/30 rounded hover:bg-flexPrimary/10 hover:border-flexPrimary disabled:opacity-50 disabled:cursor-not-allowed text-flexPrimary font-medium transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
