import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Audit Log - Security Events`,
  description: 'View audit trail of all admin activities, user actions, and security events in NatureKart.',
  robots: { index: false, follow: false },
};

export default function AdminAuditLogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
