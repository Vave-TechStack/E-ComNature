import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `My Wishlist - Saved Items`,
  description: 'View and manage your saved wishlist items on NatureKart. Keep track of products you love and add them to your cart anytime.',
};

export default function ProfileWishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
