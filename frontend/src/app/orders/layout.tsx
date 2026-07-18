import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `My Orders - Order History`,
  description: 'Track, manage, and view your order history at NatureKart. Check order status, download invoices, and reorder your favorite natural products.',
  openGraph: {
    title: `My Orders - Order History`,
    description: 'Track and manage all your NatureKart orders in one place.',
  },
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
