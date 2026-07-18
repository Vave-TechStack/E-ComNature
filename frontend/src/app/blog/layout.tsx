import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Blog - Stories from Nature's Kitchen`,
  description: 'Explore articles about natural foods, healthy living, traditional wisdom, and recipes. Tips on millets, forest honey, cold pressed oils, A2 ghee, and more natural products.',
  openGraph: {
    title: `Blog - Stories from Nature's Kitchen`,
    description: 'Tips, recipes, and insights about natural foods, healthy living, and traditional wisdom.',
    images: [{ url: '/apple-touch-icon.svg', width: 180, height: 180 }],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
