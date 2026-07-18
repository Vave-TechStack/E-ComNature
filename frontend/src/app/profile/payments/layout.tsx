import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Payment Methods - Saved Cards & UPI`,
  description: 'Manage your saved payment methods for faster checkout at NatureKart. Add, edit, or remove credit/debit cards and UPI IDs.',
};

export default function PaymentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
