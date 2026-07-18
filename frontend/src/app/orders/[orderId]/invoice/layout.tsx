import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Order Invoice`,
  description: 'Download your NatureKart order invoice for records and GST claims.',
  robots: { index: false, follow: true },
};

export default function InvoiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
