import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Track Your Order - Real-Time Updates`,
  description: 'Track your NatureKart order in real-time. Enter your order ID to get live delivery updates, estimated delivery date, and shipping status.',
  openGraph: {
    title: `Track Your Order`,
    description: 'Real-time order tracking for all NatureKart orders.',
  },
};

export default function TrackingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
