import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Checkout - Secure Payment`,
  description: 'Complete your order at NatureKart. Fast and secure checkout with multiple payment options including UPI, cards, net banking, and COD.',
  robots: { index: false, follow: true },
  openGraph: {
    title: `Secure Checkout`,
    description: 'Complete your order with secure payment options.',
  },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
