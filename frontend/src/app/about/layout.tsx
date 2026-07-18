import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `About Us - Our Story & Mission`,
  description: 'Discover the story behind NatureKart. We bring pure, natural foods from India\'s farms, forests, and tribal communities directly to your table. 12,000+ farmers supported, 100% chemical-free.',
  openGraph: {
    title: `About NatureKart - Pure & Natural Foods`,
    description: 'Connecting you with nature\'s bounty. Direct from farms, forests & tribal communities.',
    images: [{ url: '/apple-touch-icon.svg', width: 180, height: 180 }],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
