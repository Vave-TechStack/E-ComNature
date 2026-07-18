import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Products - Natural & Organic Foods`,
  description: 'Browse our complete collection of premium natural foods: forest honey, organic millets, cold pressed oils, A2 ghee, natural spices, herbal teas, and more. Direct from farms and tribal communities.',
  openGraph: {
    title: `All Natural Products`,
    description: 'Browse our complete collection of premium natural foods, sourced directly from farms and tribal communities.',
    images: [{ url: '/apple-touch-icon.svg', width: 180, height: 180 }],
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
