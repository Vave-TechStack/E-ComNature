import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Create Account - Join NatureKart`,
  description: 'Create your NatureKart account and start shopping premium natural foods. Enjoy exclusive member benefits, reward points, and easy order tracking.',
  robots: { index: false, follow: true },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
