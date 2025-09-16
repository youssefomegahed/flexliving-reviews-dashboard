'use client';

import { useState } from 'react';
import type { ReviewFilters } from '@/hooks/useReviews';

interface FiltersPanelProps {
  filters: ReviewFilters;
  onFiltersChange: (filters: ReviewFilters) => void;
  onReset: () => void;
}

export default function FiltersPanel({
  filters,
  onFiltersChange,
  onReset,
}: FiltersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (
    key: keyof ReviewFilters,
    value: ReviewFilters[keyof ReviewFilters],
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-flexPrimary">Filters</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-3 py-1 text-sm text-gray-600 hover:text-flexPrimary transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1 text-sm bg-flexPrimary text-white rounded-lg hover:bg-flexPrimary/90 transition-colors"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>

        {/* Quick filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => updateFilter('approved', undefined)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filters.approved === undefined
                ? 'bg-flexPrimary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Reviews
          </button>
          <button
            onClick={() => updateFilter('approved', false)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filters.approved === false
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => updateFilter('approved', true)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filters.approved === true
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved
          </button>
        </div>

        {/* Expanded filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            {/* Rating Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  placeholder="Min"
                  value={filters.minRating || ''}
                  onChange={(e) =>
                    updateFilter(
                      'minRating',
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flexPrimary focus:border-transparent"
                />
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  placeholder="Max"
                  value={filters.maxRating || ''}
                  onChange={(e) =>
                    updateFilter(
                      'maxRating',
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flexPrimary focus:border-transparent"
                />
              </div>
            </div>

            {/* Channel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Channel
              </label>
              <select
                value={filters.channel || ''}
                onChange={(e) =>
                  updateFilter('channel', e.target.value || undefined)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flexPrimary focus:border-transparent"
              >
                <option value="">All Channels</option>
                <option value="airbnb">Airbnb</option>
                <option value="booking">Booking.com</option>
                <option value="vrbo">VRBO</option>
                <option value="direct">Direct</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) =>
                  updateFilter('category', e.target.value || undefined)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flexPrimary focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="cleanliness">Cleanliness</option>
                <option value="communication">Communication</option>
                <option value="respect_house_rules">Respect House Rules</option>
                <option value="check-in">Check-in</option>
                <option value="accuracy">Accuracy</option>
                <option value="location">Location</option>
                <option value="value">Value</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) =>
                    updateFilter('startDate', e.target.value || undefined)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flexPrimary focus:border-transparent"
                />
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) =>
                    updateFilter('endDate', e.target.value || undefined)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-flexPrimary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
