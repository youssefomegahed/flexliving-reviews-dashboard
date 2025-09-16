import Image from 'next/image';

export default function DashboardHeader() {
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
          <h1 className="text-3xl font-bold text-flexPrimary mb-2">
            Flex Living Reviews Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-1">
            Manage and analyze guest reviews across all properties
          </p>
          <p className="text-sm text-gray-500">Last updated: {currentDate}</p>
        </div>

        <div className="flex items-center gap-4">
          <Image
            className="rounded-full"
            src="/logo.jpeg"
            alt="Flex Living"
            width={100}
            height={100}
          />
        </div>
      </div>
    </header>
  );
}
