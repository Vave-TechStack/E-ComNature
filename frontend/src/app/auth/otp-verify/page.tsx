'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Smartphone, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { authService } from '@/services/auth';

function OtpVerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0 && !canResend) {
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer, canResend]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
  };

  const handleSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (!phone) {
      setError('Phone number is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.verifyOtp(phone, otpString);
      router.push('/');
    } catch {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !phone) return;
    setCanResend(false);
    setResendTimer(30);
    try {
      await authService.sendOtp(phone);
    } catch {
      setError('Failed to resend OTP');
    }
  };

  return (
    <AuthLayout
      title="Verify OTP"
      subtitle={`Enter the 6-digit code sent to ${phone || 'your phone'}`}
      alternateLink={{
        text: 'Use a different method?',
        href: '/auth/login',
        label: 'Sign in instead',
      }}
    >
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 border border-primary-100">
            <ShieldCheck className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center gap-3" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="h-14 w-12 rounded-xl border-2 border-noble-200 text-center text-xl font-bold text-noble-900
                         focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none
                         transition-all duration-200 bg-white"
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        <Button
          type="submit"
          disabled={isLoading || otp.join('').length !== 6}
          className="w-full h-12 bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded-xl shadow-sm shadow-primary-200/50 text-base"
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</>
          ) : (
            'Verify OTP'
          )}
        </Button>

        <div className="text-center">
          {canResend ? (
            <Button variant="link" onClick={handleResend} className="text-primary-700 hover:text-primary-800 font-semibold">
              Resend OTP
            </Button>
          ) : (
            <p className="text-sm text-noble-500">
              Resend code in <span className="font-semibold text-noble-800">{resendTimer}s</span>
            </p>
          )}
        </div>

        <Link href="/auth/login">
          <Button variant="ghost" className="w-full gap-2 text-noble-500 hover:text-primary-700 hover:bg-primary-50 font-semibold">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Button>
        </Link>
      </form>
    </AuthLayout>
  );
}

export default function OtpVerifyPage() {
  return (
    <Suspense fallback={
      <AuthLayout title="Verify OTP" subtitle="Loading..." alternateLink={{ text: '', href: '/auth/login', label: '' }}>
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </AuthLayout>
    }>
      <OtpVerifyForm />
    </Suspense>
  );
}
