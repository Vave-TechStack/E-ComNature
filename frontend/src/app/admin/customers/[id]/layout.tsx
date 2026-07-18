import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Customer Details - Admin`,
  description: 'View detailed customer profile, order history, support interactions, and account activity.',
  robots: { index: false, follow: false },
};

export default function CustomerDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
