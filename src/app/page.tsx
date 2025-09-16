'use client';

import { useReviews, useApproveReview } from '@/hooks/useReviews';

export default function Dashboard() {
  const { data: reviews, isLoading, error } = useReviews();
  const { mutate: approveReview } = useApproveReview();

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

  if (error) {
    return (
      <div className="min-h-screen bg-flexBg flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-flexText text-lg">Error loading reviews</p>
          <p className="text-gray-500 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-flexBg">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-flexPrimary mb-2">
            Flex Living Reviews Dashboard
          </h1>
          <p className="text-flexText text-lg">
            Manage and approve guest reviews
          </p>
        </header>

        <div className="space-y-6">
          {reviews?.map((r) => (
            <div
              key={r.id}
              className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md ${
                r.approved ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-flexPrimary mb-1">
                    {r.listingName}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Source: {r.source}</span>
                    {r.rating && (
                      <span className="flex items-center">⭐ {r.rating}/5</span>
                    )}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        r.approved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {r.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-flexText mb-4 leading-relaxed">"{r.text}"</p>

              {r.authorName && (
                <p className="text-sm text-gray-600 mb-4">— {r.authorName}</p>
              )}

              <div className="flex justify-end">
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    r.approved
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-flexPrimary hover:bg-flexPrimary/90 text-white'
                  }`}
                  onClick={() =>
                    approveReview({ id: r.id, approved: !r.approved })
                  }
                >
                  {r.approved ? 'Unapprove' : 'Approve'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {reviews?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <p className="text-flexText text-lg">No reviews found</p>
            <p className="text-gray-500 mt-2">
              Reviews will appear here once they're loaded
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
