import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Authentication Error`,
  description: 'There was an authentication error. Please try again or contact support.',
  robots: { index: false, follow: true },
};

export default function AuthErrorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
