import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Help Center - Customer Support`,
  description: 'Get help with your NatureKart orders, returns, and account. Contact our support team via chat, email at hello@naturekart.in, or call 1800-123-8900.',
  openGraph: {
    title: `Help Center - Customer Support`,
    description: 'We are here to help. Contact our support team for any assistance.',
  },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
