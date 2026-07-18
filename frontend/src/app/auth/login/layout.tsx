import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Sign In - Login to Your Account`,
  description: 'Sign in to your NatureKart account to continue shopping. Access your orders, wishlist, saved addresses, and reward points.',
  robots: { index: false, follow: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
