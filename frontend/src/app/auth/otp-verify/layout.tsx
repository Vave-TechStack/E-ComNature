import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Verify OTP - Secure Login`,
  description: 'Verify your identity with the OTP sent to your registered phone number. Secure two-factor authentication for your NatureKart account.',
  robots: { index: false, follow: true },
};

export default function OtpVerifyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
