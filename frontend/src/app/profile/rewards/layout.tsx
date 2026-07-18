import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Reward Points - Earn & Redeem`,
  description: 'Track your NatureKart reward points. Earn points on every purchase, redeem for discounts, and enjoy exclusive member benefits.',
};

export default function RewardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
