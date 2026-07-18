import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Notification Preferences - Stay Updated`,
  description: 'Manage your notification preferences for NatureKart. Choose how you want to receive order updates, offers, and product recommendations.',
};

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
