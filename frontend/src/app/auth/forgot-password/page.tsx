'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validators/auth';
import { authService } from '@/services/auth';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError('');
    try {
      await authService.forgotPassword(data.emailOrPhone);
      setIsSent(true);
    } catch {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <AuthLayout
        title="Check Your Inbox"
        subtitle="We've sent a password reset link to your registered email/phone"
        alternateLink={{
          text: 'Remember your password?',
          href: '/auth/login',
          label: 'Sign in',
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Didn't receive the email? Check your spam folder or
            </p>
            <Button
              variant="link"
              className="text-primary-600"
              onClick={() => setIsSent(false)}
            >
              Try another email/phone
            </Button>
          </div>

          <a href="/auth/login">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Button>
          </a>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="No worries! Enter your email or phone and we'll send you a reset link"
      alternateLink={{
        text: 'Remember your password?',
        href: '/auth/login',
        label: 'Sign in',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          </motion.div>
        )}

        <div>
          <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email or Phone Number
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="emailOrPhone"
              type="text"
              placeholder="Enter your email or phone"
              className="pl-10 h-12"
              {...register('emailOrPhone')}
            />
          </div>
          {errors.emailOrPhone && (
            <p className="mt-1 text-xs text-red-500">{errors.emailOrPhone.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full h-12 gradient-primary">
          {isLoading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
