import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Order Details`,
  description: 'View complete details of your NatureKart order including items ordered, payment status, delivery address, and real-time tracking updates.',
  robots: { index: false, follow: true },
};

export default function OrderDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
