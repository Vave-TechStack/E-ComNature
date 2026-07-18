import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `My Wishlist - Saved Items`,
  description: 'View your saved wishlist items at NatureKart. Shop your favorite natural products later and never miss out on your preferred organic foods.',
  openGraph: {
    title: `My Wishlist | ${APP_NAME}`,
    description: 'Save your favorite natural products and shop later.',
  },
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
