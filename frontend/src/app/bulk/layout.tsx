import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Bulk Orders - Wholesale Natural Foods`,
  description: 'Order natural foods in bulk from NatureKart. Special pricing for businesses, bulk discounts on honey, millets, oils, ghee, spices, and more. Pan-India delivery.',
  openGraph: {
    title: `Bulk Orders - Wholesale Natural Foods`,
    description: 'Premium natural foods at wholesale prices. Bulk orders pan-India.',
  },
};

export default function BulkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
