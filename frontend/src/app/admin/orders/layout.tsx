import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Manage Orders - Admin`,
  description: 'View and manage all customer orders. Process, ship, track, and handle returns for NatureKart orders.',
  robots: { index: false, follow: false },
};

export default function AdminOrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
