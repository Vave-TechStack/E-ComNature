import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Privacy Policy - Data Protection`,
  description: 'NatureKart\'s privacy policy. Learn how we collect, use, and protect your personal information. We take your privacy seriously with industry-standard security measures.',
  robots: { index: false, follow: true },
  openGraph: {
    title: `Privacy Policy`,
    description: 'Learn how NatureKart protects your personal information.',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
