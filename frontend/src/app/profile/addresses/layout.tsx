import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `My Addresses - Manage Delivery Addresses`,
  description: 'Manage your saved delivery addresses for NatureKart orders. Add, edit, or remove addresses and set default delivery locations.',
};

export default function AddressesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
