'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Review } from '@/types/review';

export default function TrendChart({ reviews }: { reviews: Review[] }) {
  const grouped = reviews.reduce<Record<string, number[]>>((acc, r) => {
    const d = r.createdAt.slice(0, 10);
    (acc[d] ||= []).push(r.rating ?? 0);
    return acc;
  }, {});

  const data = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, arr]) => ({
      date,
      formattedDate: new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      rating: arr.reduce((s, n) => s + n, 0) / (arr.length || 1),
    }));

  return (
    <section className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4 text-flexPrimary">
        Rating Trend
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="flex" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#284f4d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#284f4d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="formattedDate" />
            <YAxis domain={[0, 5]} />
            <Tooltip
              labelFormatter={(value, payload) => {
                if (payload && payload[0]) {
                  const data = payload[0].payload;
                  return new Date(data.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                }
                return value;
              }}
              formatter={(value) => [`${Number(value).toFixed(1)}`, 'Rating']}
            />
            <Area
              type="monotone"
              dataKey="rating"
              stroke="#284f4d"
              fillOpacity={1}
              fill="url(#flex)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
