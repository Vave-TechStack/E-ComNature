import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Live Chat - Instant Support`,
  description: 'Chat with NatureKart support team in real-time. Get instant help with orders, returns, product inquiries, and account assistance.',
  robots: { index: false, follow: true },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
