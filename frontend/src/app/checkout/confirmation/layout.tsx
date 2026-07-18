import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Order Confirmation - Thank You`,
  description: 'Your order has been confirmed! Track your order and get real-time delivery updates for your NatureKart natural foods delivery.',
  robots: { index: false, follow: true },
};

export default function ConfirmationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
