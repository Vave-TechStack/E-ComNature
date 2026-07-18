import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Press & Media - News & Coverage`,
  description: 'Latest news, announcements, and media coverage about NatureKart. Read about our tribal sourcing network, farmer partnerships, and organic food revolution.',
  openGraph: {
    title: `Press & Media - News & Coverage`,
    description: 'Latest news and media coverage about NatureKart.',
  },
};

export default function PressLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
