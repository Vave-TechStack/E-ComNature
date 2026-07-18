import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Maintenance - Site Under Upgrades`,
  description: 'NatureKart is currently undergoing scheduled maintenance to improve your shopping experience. We will be back shortly.',
  robots: { index: false, follow: false },
};

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
