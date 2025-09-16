'use client';

import { useState, useMemo } from 'react';
import { useAllReviews, useReviews } from '@/hooks/useReviews';
import { useDebounce } from '@/hooks/useDebounce';
import type {
  ReviewFilters,
  SortOptions,
  PaginationParams,
} from '@/hooks/useReviews';
import DashboardHeader from '@/components/dashboard/Header';
import KpiGrid from '@/components/dashboard/KpiGrid';
import TrendChart from '@/components/dashboard/TrendChart';
import ReviewsTable from '@/components/dashboard/ReviewsTable';
import FiltersPanel from '@/components/dashboard/FiltersPanel';

export default function DashboardPage() {
  const [filters, setFilters] = useState<ReviewFilters>({});
  const [sort, setSort] = useState<SortOptions>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });

  const debouncedFilters = useDebounce(filters, 300);

  const queryParams = useMemo(
    () => ({
      filters: debouncedFilters,
      pagination,
      sort,
    }),
    [debouncedFilters, pagination, sort],
  );

  const {
    data: reviewsResponse,
    isLoading,
    error,
  } = useReviews(queryParams.filters, queryParams.pagination, queryParams.sort);
  const reviews = reviewsResponse?.data || [];

  // Get filtered data for the table, chart, and KPIs
  const { data: allReviewsResponse } = useAllReviews(debouncedFilters);
  const allReviews = allReviewsResponse?.data || [];

  // KPIs and chart should show filtered data
  const total = allReviews.length;
  const avg =
    total > 0
      ? (allReviews.reduce((s, r) => s + (r.rating ?? 0), 0) / total).toFixed(2)
      : 'N/A';
  const approved = allReviews.filter((r) => r.status === 'published').length;
  const pending = allReviews.filter((r) => r.status === 'unpublished').length;

  // Determine current filter state for KPI display
  const currentFilter =
    filters.approved === true
      ? 'approved'
      : filters.approved === false
        ? 'pending'
        : 'all';

  const handleFiltersChange = (newFilters: ReviewFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  const handleSortChange = (newSort: SortOptions) => {
    setSort(newSort);
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination({ ...pagination, pageSize, page: 1 });
  };

  const handleReset = () => {
    setFilters({});
    setSort({ sortBy: 'createdAt', sortOrder: 'desc' });
    setPagination({ page: 1, pageSize: 10 });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-flexBg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flexPrimary mx-auto mb-4"></div>
          <p className="text-flexText text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-flexBg flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error loading dashboard
          </h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-flexBg">
      <main className="container mx-auto px-4 py-8 space-y-8">
        <DashboardHeader />

        <FiltersPanel
          filters={filters}
          sort={sort}
          onFiltersChange={handleFiltersChange}
          onSortChange={handleSortChange}
          onReset={handleReset}
        />

        <KpiGrid
          total={total}
          avg={avg}
          approved={approved}
          pending={pending}
          currentFilter={currentFilter}
        />

        <TrendChart reviews={allReviews} />

        <ReviewsTable
          reviews={reviews}
          currentPage={reviewsResponse?.page || 1}
          totalPages={reviewsResponse?.totalPages || 1}
          totalItems={reviewsResponse?.total || 0}
          pageSize={pagination.pageSize || 10}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </main>
    </div>
  );
}
