import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `My Orders - Order History & Tracking`,
  description: 'View your complete order history from NatureKart. Track delivery status, download invoices, and reorder your favorite natural products.',
};

export default function ProfileOrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
