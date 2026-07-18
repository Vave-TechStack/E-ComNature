import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Quality Promise - Purity & Authenticity Guaranteed`,
  description: 'NatureKart\'s quality promise: Authenticity guaranteed, lab tested, 100% natural, fair trade certified, direct from producers, and satisfaction guaranteed.',
  openGraph: {
    title: `Quality Promise - Purity & Authenticity Guaranteed`,
    description: 'We are committed to bringing you the purest, most authentic natural foods.',
  },
};

export default function QualityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
