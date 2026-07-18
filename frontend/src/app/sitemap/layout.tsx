import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Sitemap - Explore All Pages`,
  description: 'Complete sitemap of NatureKart website. Browse all product categories, account pages, support resources, and company information in one place.',
  robots: { index: false, follow: true },
};

export default function SitemapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
