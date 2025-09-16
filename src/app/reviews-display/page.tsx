'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useReviews } from '@/hooks/useReviews';
import type {
  ReviewFilters,
  SortOptions,
  PaginationParams,
} from '@/hooks/useReviews';
import DashboardHeader from '@/components/dashboard/Header';
import ReviewsTable from '@/components/dashboard/ReviewsTable';

export default function ReviewsDisplayPage() {
  // Default to showing only approved reviews
  const [filters] = useState<ReviewFilters>({ approved: true });
  const [sort, setSort] = useState<SortOptions>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });

  // Fetch paginated reviews (only approved by default)
  const {
    data: reviewsResponse,
    isLoading,
    isFetching,
    error,
  } = useReviews(filters, pagination, sort);
  const reviews = reviewsResponse?.data || [];

  // Handlers
  const handleSortChange = (newSort: SortOptions) => {
    setSort(newSort);
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination({ ...pagination, pageSize, page: 1 });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-flexBg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flexPrimary mx-auto mb-4"></div>
          <p className="text-flexText text-lg">Loading reviews...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-flexBg flex items-center justify-center">
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
    <div className="min-h-screen bg-flexBg">
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Back button above header */}
        <div className="flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-flexPrimary transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <DashboardHeader
          title="Approved Reviews Display"
          subtitle="View all approved reviews in one place!"
        />

        <ReviewsTable
          reviews={reviews}
          currentPage={reviewsResponse?.page || 1}
          totalPages={reviewsResponse?.totalPages || 1}
          totalItems={reviewsResponse?.total || 0}
          pageSize={pagination.pageSize || 10}
          sort={sort}
          isFetching={isFetching}
          showViewAllButton={false}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSortChange={handleSortChange}
        />
      </main>
    </div>
  );
}
