import type { Metadata } from 'next';
import './globals.css';
import { ReactQueryProvider } from '@/providers';

export const metadata: Metadata = {
  title: 'Flex Living Reviews Dashboard',
  description: 'Manage and approve guest reviews for Flex Living properties',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
