import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Categories - Browse Natural Foods`,
  description: 'Browse all natural food categories at NatureKart: Natural Honey, Millets & Grains, Cold Pressed Oils, A2 Ghee, Natural Spices, Herbal Tea, Pickles, Dry Fruits, and more.',
  openGraph: {
    title: `Categories - Browse Natural Foods`,
    description: 'Explore our complete range of natural food categories.',
  },
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
