import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Forgot Password - Reset Your Password`,
  description: 'Reset your NatureKart account password. Enter your registered email or phone number to receive a password reset link.',
  robots: { index: false, follow: true },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
