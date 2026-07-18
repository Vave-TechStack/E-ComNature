import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Our Farmers - Meet the Heroes Behind Your Food`,
  description: 'Meet the dedicated farmers and tribal harvesters who grow pure, natural food for NatureKart. From Araku Valley honey to Meghalaya turmeric, every product has a story.',
  openGraph: {
    title: `Our Farmers - Meet the Heroes Behind Your Food`,
    description: 'The real heroes behind every natural product — dedicated farmers and tribal harvesters.',
    images: [{ url: '/apple-touch-icon.svg', width: 180, height: 180 }],
  },
};

export default function FarmersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
