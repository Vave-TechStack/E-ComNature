import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Manage Customers - Admin`,
  description: 'View and manage NatureKart customers. Access order history, support tickets, reward points, and customer profiles.',
  robots: { index: false, follow: false },
};

export default function AdminCustomersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
