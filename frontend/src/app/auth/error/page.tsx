'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AlertTriangle, ArrowLeft, Leaf, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const errorMessages: Record<string, { title: string; message: string }> = {
  Configuration: {
    title: 'Configuration Error',
    message: 'There is an issue with the authentication configuration. Please contact support if this persists.',
  },
  AccessDenied: {
    title: 'Access Denied',
    message: 'You do not have permission to access this resource. Please log in with an authorized account.',
  },
  Verification: {
    title: 'Verification Failed',
    message: 'The verification link is invalid or has expired. Please request a new one.',
  },
  CredentialsSignin: {
    title: 'Invalid Credentials',
    message: 'The email or password you entered is incorrect. Please try again.',
  },
  SessionRequired: {
    title: 'Session Required',
    message: 'Please sign in to access this page.',
  },
  Default: {
    title: 'Authentication Error',
    message: 'An unexpected authentication error occurred. Please try again.',
  },
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error') || 'Default';
  const errorInfo = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-[#F8FFF5] flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-green-100/50 border border-green-100 p-8 sm:p-10 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 border border-red-100 flex items-center justify-center"
          >
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </motion.div>

          {/* Leaf Decoration */}
          <motion.div
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Leaf className="w-4 h-4 text-[#2E7D32]" />
            <span className="text-xs font-medium text-[#4CAF50] tracking-wider uppercase">Authentication</span>
            <Leaf className="w-4 h-4 text-[#2E7D32]" />
          </motion.div>

          {/* Error Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-2xl font-bold text-gray-900 mb-3"
          >
            {errorInfo.title}
          </motion.h1>

          {/* Error Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-gray-600 text-sm leading-relaxed mb-2"
          >
            {errorInfo.message}
          </motion.p>

          {/* Error Code Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs text-gray-500 font-mono mb-8"
          >
            Error: <span className="text-red-500 font-semibold">{error}</span>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link href="/auth/login" className="flex-1">
              <Button className="w-full gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white shadow-lg shadow-green-200 h-11 text-sm font-semibold">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full gap-2 border-[#2E7D32] text-[#2E7D32] hover:bg-green-50 h-11 text-sm font-semibold">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>
          </motion.div>

          {/* Retry Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="mt-6"
          >
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 text-sm text-[#4CAF50] hover:text-[#2E7D32] transition-colors font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="text-center mt-6 text-xs text-gray-400"
        >
          If the problem persists, please{' '}
          <Link href="/support" className="text-[#4CAF50] hover:text-[#2E7D32] underline transition-colors">
            contact our support team
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FFF5] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
