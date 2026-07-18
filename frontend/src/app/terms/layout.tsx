import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Terms & Conditions - Legal Information`,
  description: 'NatureKart\'s terms and conditions covering account registration, products & pricing, orders & payment, shipping & delivery, returns & refunds, and intellectual property.',
  robots: { index: false, follow: true },
  openGraph: {
    title: `Terms & Conditions`,
    description: 'Terms and conditions for using NatureKart\'s website and services.',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
