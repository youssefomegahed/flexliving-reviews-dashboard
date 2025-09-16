import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { Review } from '@/types/review';

export type ReviewFilters = {
  listingId?: string;
  approved?: boolean;
  minRating?: number;
};

export function useReviews(filters?: ReviewFilters) {
  return useQuery({
    queryKey: ['reviews', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.listingId) params.append('listingId', filters.listingId);
      if (filters?.approved !== undefined)
        params.append('approved', String(filters.approved));
      if (filters?.minRating !== undefined)
        params.append('minRating', String(filters.minRating));

      const query = params.toString();
      const url = query
        ? `/api/reviews/hostaway?${query}`
        : '/api/reviews/hostaway';
      const data = await apiFetch<{ data: Review[] }>(url);
      return data.data;
    },
  });
}

export function useApproveReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      return apiFetch<{ success: boolean; review: Review }>(
        '/api/reviews/approve',
        {
          method: 'POST',
          body: JSON.stringify({ id, approved }),
        },
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
