import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Blog Post`,
  description: 'Read our latest blog post about natural foods, healthy living, and traditional wisdom.',
  openGraph: {
    title: `Blog - Nature's Kitchen`,
    description: 'Tips, recipes, and insights about natural foods.',
  },
};

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
