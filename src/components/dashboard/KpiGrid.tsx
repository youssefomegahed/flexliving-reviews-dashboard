type KpiProps = {
  total: number;
  avg: string;
  approved: number;
  pending: number;
  currentFilter?: 'approved' | 'pending' | 'all';
};

export default function KpiGrid({
  total,
  avg,
  approved,
  pending,
  currentFilter,
}: KpiProps) {
  const allKpis = [
    {
      label: 'Total Reviews',
      value: total,
      icon: '📊',
      color: 'text-flexPrimary',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Average Rating',
      value: avg,
      icon: '⭐',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      label: 'Approved',
      value: approved,
      icon: '✅',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      label: 'Pending',
      value: pending,
      icon: '⏳',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
  ];

  // Filter out redundant KPI cards based on current filter
  const kpis = allKpis.filter((kpi) => {
    if (
      (currentFilter === 'approved' || currentFilter === 'pending') &&
      (kpi.label === 'Approved' || kpi.label === 'Pending')
    )
      return false;
    return true;
  });

  // Dynamic grid layout based on number of visible cards
  const gridCols =
    kpis.length === 2
      ? 'grid-cols-2'
      : kpis.length === 3
        ? 'grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-2 lg:grid-cols-4';

  return (
    <section className={`grid ${gridCols} gap-4 mb-8`}>
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className={`${kpi.bgColor} ${kpi.borderColor} border rounded-xl p-6 transition-all duration-200 hover:shadow-md hover:scale-105`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl">{kpi.icon}</div>
            <div
              className={`text-xs font-medium ${kpi.color} px-2 py-1 rounded-full bg-white/50`}
            >
              {kpi.label}
            </div>
          </div>
          <div className={`text-3xl font-bold ${kpi.color} mb-1`}>
            {kpi.value}
          </div>
          <div className="text-xs text-gray-600">
            {kpi.label === 'Average Rating' ? 'out of 5.0' : 'reviews'}
          </div>
        </div>
      ))}
    </section>
  );
}
