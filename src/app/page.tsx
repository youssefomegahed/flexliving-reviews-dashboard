'use client';

import { useReviews, useApproveReview } from '@/hooks/useReviews';

export default function Dashboard() {
  const { data: reviews, isLoading, error } = useReviews();
  const { mutate: approveReview } = useApproveReview();

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error loading reviews</p>;

  return (
    <div className="space-y-4">
      {reviews?.map((r) => (
        <div key={r.id} className="border p-4 rounded">
          <p className="font-semibold">{r.listingName}</p>
          <p>{r.text}</p>
          <p>Rating: {r.rating ?? 'N/A'}</p>
          <button
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => approveReview({ id: r.id, approved: !r.approved })}
          >
            {r.approved ? 'Unapprove' : 'Approve'}
          </button>
        </div>
      ))}
    </div>
  );
}
