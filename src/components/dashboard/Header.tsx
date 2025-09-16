import Image from 'next/image';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function DashboardHeader({
  title = 'Flex Living Reviews Dashboard',
  subtitle = 'Manage and analyze guest reviews across all properties',
}: DashboardHeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-flexPrimary mb-2">{title}</h1>
          <p className="text-lg text-gray-600 mb-1">{subtitle}</p>
          <p className="text-sm text-gray-500">Last updated: {currentDate}</p>
        </div>
        <Image
          className="rounded-full"
          src="/logo.jpeg"
          alt="Flex Living"
          width={100}
          height={100}
        />
      </div>
    </header>
  );
}
