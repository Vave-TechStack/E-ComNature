import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Admin Settings - Configuration`,
  description: 'Configure NatureKart admin settings including general preferences, notifications, security, and integrations.',
  robots: { index: false, follow: false },
};

export default function AdminSettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
