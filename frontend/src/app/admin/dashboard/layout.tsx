import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Admin Dashboard - Analytics & Overview`,
  description: 'NatureKart admin dashboard. Monitor sales, revenue, orders, visitors, and low stock alerts. Complete business analytics at a glance.',
  robots: { index: false, follow: false },
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
