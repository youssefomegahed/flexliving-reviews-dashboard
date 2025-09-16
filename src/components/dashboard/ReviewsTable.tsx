'use client';

import type { Review } from '@/types/review';
import type { SortOptions } from '@/hooks/useReviews';
import { useApproveReview } from '@/hooks/useReviews';
import React from 'react';
import Link from 'next/link';
import Pagination from './Pagination';

interface ReviewsTableProps {
  reviews: Review[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  sort: SortOptions;
  isFetching?: boolean;
  showViewAllButton?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (sort: SortOptions) => void;
}

export default function ReviewsTable({
  reviews,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  sort,
  isFetching = false,
  showViewAllButton = false,
  onPageChange,
  onPageSizeChange,
  onSortChange,
}: ReviewsTableProps) {
  const approveMutation = useApproveReview();

  if (reviews.length === 0) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No reviews found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters to see more results.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-flexPrimary">Reviews</h2>
            <div className="text-sm text-gray-600">
              {totalItems} total reviews
            </div>
          </div>

          {/* Sorting controls and navigation button - responsive */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <label className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={sort.sortBy || 'createdAt'}
                  onChange={(e) =>
                    onSortChange({
                      ...sort,
                      sortBy: e.target.value as
                        | 'createdAt'
                        | 'rating'
                        | 'listingName',
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flexPrimary focus:border-transparent text-sm min-w-0 sm:min-w-[140px]"
                >
                  <option value="createdAt">Date</option>
                  <option value="rating">Rating</option>
                  <option value="listingName">Property Name</option>
                </select>
                <select
                  value={sort.sortOrder || 'desc'}
                  onChange={(e) =>
                    onSortChange({
                      ...sort,
                      sortOrder: e.target.value as 'asc' | 'desc',
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flexPrimary focus:border-transparent text-sm min-w-0 sm:min-w-[120px]"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>

            {/* Navigation button */}
            {showViewAllButton && (
              <Link
                href="/reviews-display"
                className="px-3 py-1 bg-flexPrimary text-white rounded-lg hover:bg-flexPrimary/90 transition-colors text-sm font-medium"
              >
                Visit Reviews Display
              </Link>
            )}
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Property
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Rating
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Channel
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Review
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">
                      {r.listingName}
                    </div>
                    <div className="text-sm text-gray-500">{r.authorName}</div>
                  </td>
                  <td className="py-4 px-4">
                    {r.rating ? (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-medium">{r.rating}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {r.channel || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {r.text}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium ${
                        r.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {r.status === 'published' ? 'Published' : 'Not Published'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() =>
                        approveMutation.mutate({
                          id: r.id,
                          approved: r.status !== 'published',
                        })
                      }
                      disabled={approveMutation.isPending || isFetching}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        r.status === 'published'
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-flexPrimary hover:bg-flexPrimary/90 text-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {approveMutation.isPending || isFetching
                        ? '...'
                        : r.status === 'published'
                          ? 'Unapprove'
                          : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="space-y-4 lg:hidden">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="border border-gray-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-900">
                    {r.listingName}
                  </div>
                  <div className="text-sm text-gray-500">{r.authorName}</div>
                </div>
                <span
                  className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium ${
                    r.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {r.status === 'published' ? 'Published' : 'Not Published'}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                {r.rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span>{r.rating}</span>
                  </div>
                )}
                <span>{r.channel || 'Unknown'}</span>
                <span>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>

              <p className="text-sm text-gray-700 line-clamp-3">{r.text}</p>

              <button
                onClick={() =>
                  approveMutation.mutate({
                    id: r.id,
                    approved: r.status !== 'published',
                  })
                }
                disabled={approveMutation.isPending}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  r.status === 'published'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-flexPrimary hover:bg-flexPrimary/90 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {approveMutation.isPending
                  ? 'Processing...'
                  : r.status === 'published'
                    ? 'Unapprove'
                    : 'Approve'}
              </button>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </section>
  );
}
