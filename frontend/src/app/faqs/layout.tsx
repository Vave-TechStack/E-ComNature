import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `FAQs - Frequently Asked Questions`,
  description: 'Find answers to common questions about NatureKart products, organic certifications, shipping, returns, payments, and more. Everything you need to know about our natural foods.',
  openGraph: {
    title: `FAQs - Frequently Asked Questions`,
    description: 'Everything you need to know about our natural products and services.',
  },
};

export default function FaqsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
