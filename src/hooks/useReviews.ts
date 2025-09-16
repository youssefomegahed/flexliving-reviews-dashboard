import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { Review } from '@/types/review';

export type ReviewFilters = {
  listingId?: string;
  approved?: boolean;
  minRating?: number;
  maxRating?: number;
  channel?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
};

export type SortOptions = {
  sortBy?: 'createdAt' | 'rating' | 'listingName';
  sortOrder?: 'asc' | 'desc';
};

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type ReviewsResponse = {
  data: Review[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export function useReviews(
  filters?: ReviewFilters,
  pagination?: PaginationParams,
  sort?: SortOptions,
) {
  return useQuery({
    queryKey: ['reviews', filters, pagination, sort],
    queryFn: async (): Promise<ReviewsResponse> => {
      const params = new URLSearchParams();

      if (filters?.listingId) params.append('listingId', filters.listingId);
      if (filters?.approved !== undefined)
        params.append('approved', String(filters.approved));
      if (filters?.minRating !== undefined)
        params.append('minRating', String(filters.minRating));
      if (filters?.maxRating !== undefined)
        params.append('maxRating', String(filters.maxRating));
      if (filters?.channel) params.append('channel', filters.channel);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      if (pagination?.page) params.append('page', String(pagination.page));
      if (pagination?.pageSize)
        params.append('pageSize', String(pagination.pageSize));

      if (sort?.sortBy) params.append('sortBy', sort.sortBy);
      if (sort?.sortOrder) params.append('sortOrder', sort.sortOrder);

      const query = params.toString();
      const url = query
        ? `/api/reviews/hostaway?${query}`
        : '/api/reviews/hostaway';

      const response = await apiFetch<ReviewsResponse>(url);

      const totalPages = Math.ceil(response.total / response.pageSize);

      return {
        ...response,
        totalPages,
      };
    },
  });
}

export function useAllReviews(filters?: ReviewFilters) {
  return useQuery({
    queryKey: ['all-reviews', filters],
    queryFn: async (): Promise<ReviewsResponse> => {
      const params = new URLSearchParams();

      // Add filters if provided
      if (filters?.listingId) params.append('listingId', filters.listingId);
      if (filters?.approved !== undefined)
        params.append('approved', String(filters.approved));
      if (filters?.minRating !== undefined)
        params.append('minRating', String(filters.minRating));
      if (filters?.maxRating !== undefined)
        params.append('maxRating', String(filters.maxRating));
      if (filters?.channel) params.append('channel', filters.channel);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      // Always fetch all results (no pagination)
      params.append('page', '1');
      params.append('pageSize', '1000');

      const url = `/api/reviews/hostaway?${params.toString()}`;
      const response = await apiFetch<ReviewsResponse>(url);

      const totalPages = Math.ceil(response.total / response.pageSize);

      return {
        ...response,
        totalPages,
      };
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
      // Invalidate all review-related queries to ensure UI syncs
      qc.invalidateQueries({ queryKey: ['reviews'] });
      qc.invalidateQueries({ queryKey: ['all-reviews'] });
      // Also refetch immediately to avoid stale data
      qc.refetchQueries({ queryKey: ['reviews'] });
      qc.refetchQueries({ queryKey: ['all-reviews'] });
    },
  });
}
