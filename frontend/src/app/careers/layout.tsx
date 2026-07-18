import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Careers - Join Our Team`,
  description: 'Join NatureKart and help us make pure, natural food accessible to every Indian household. Open positions: Farm Relations Manager, Quality Assurance Lead, E-commerce Manager.',
  openGraph: {
    title: `Careers at NatureKart`,
    description: 'Join our team and make a difference in natural foods.',
  },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
