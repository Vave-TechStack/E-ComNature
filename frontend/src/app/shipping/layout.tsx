import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Shipping Information - Delivery & Tracking`,
  description: 'Learn about NatureKart\'s shipping policy: free shipping on orders above ₹499, delivery timelines for metro and non-metro cities, eco-friendly packaging, and real-time order tracking.',
  openGraph: {
    title: `Shipping Information`,
    description: 'Free shipping on orders above ₹499. We deliver pure goodness to your doorstep.',
  },
};

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
