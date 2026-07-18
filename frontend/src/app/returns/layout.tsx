import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Returns & Replacements - Easy Return Policy`,
  description: 'NatureKart offers 10-day easy returns and replacements. Submit a return request, schedule a pickup, and get your refund processed within 5-7 business days.',
  openGraph: {
    title: `Returns & Replacements`,
    description: 'Easy 10-day return policy for all natural products.',
  },
};

export default function ReturnsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
