import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Shopping Cart - Review Your Items`,
  description: 'Review your shopping cart at NatureKart. Check quantities, apply coupons, and proceed to checkout for your natural foods order.',
  openGraph: {
    title: `Shopping Cart`,
    description: 'Review your natural foods cart and checkout securely.',
  },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
