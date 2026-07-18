import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Track Order #`,
  description: 'Track your NatureKart order in real-time. View delivery status, estimated arrival, and order updates.',
  robots: { index: false, follow: true },
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
