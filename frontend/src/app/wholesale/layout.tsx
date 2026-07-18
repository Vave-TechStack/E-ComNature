import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Wholesale & Bulk Orders - Partner with Us`,
  description: 'Partner with NatureKart for wholesale and bulk orders of natural foods. Special discounts, dedicated support, custom orders, and quality guaranteed for businesses.',
  openGraph: {
    title: `Wholesale & Bulk Orders | ${APP_NAME}`,
    description: 'Partner with us to bring natural foods to your customers. Bulk pricing, dedicated support, custom orders.',
  },
};

export default function WholesaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
