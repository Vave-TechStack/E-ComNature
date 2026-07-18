import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Manage Products - Admin`,
  description: 'Manage NatureKart product catalog. Add, edit, update pricing, track inventory, and manage product categories and variants.',
  robots: { index: false, follow: false },
};

export default function AdminProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
