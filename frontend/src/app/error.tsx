'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, ArrowLeft, Leaf, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50/30 via-white to-white flex items-center justify-center">
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-lg text-center"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-red-400 to-red-600 shadow-2xl shadow-red-200"
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              <AlertTriangle className="h-14 w-14 text-white" />
            </motion.div>
          </motion.div>

          {/* Error Code */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-600">
              Error 500
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight"
          >
            Something went&nbsp;
            <span className="gradient-text from-red-500 to-orange-500 bg-clip-text text-transparent">wrong</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-gray-500 max-w-md mx-auto leading-relaxed"
          >
            We encountered an unexpected error. Our team has been notified and is working on it.
            Please try again in a few moments.
          </motion.p>

          {/* Error ID */}
          {error.digest && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-3 text-xs text-gray-400 font-mono"
            >
              Error ID: {error.digest}
            </motion.p>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              className="gap-2 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200 w-full sm:w-auto"
              onClick={reset}
            >
              <RefreshCw className="h-4 w-4" /> Try Again
            </Button>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2 border-gray-300">
                <Home className="h-4 w-4" /> Go Home
              </Button>
            </Link>
            <Link href="/support" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2 border-gray-300">
                <Mail className="h-4 w-4" /> Contact Support
              </Button>
            </Link>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 pt-8 border-t border-gray-100"
          >
            <p className="text-xs text-gray-400 mb-4">While you wait, you might find these helpful:</p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <Link href="/products" className="text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1">
                <Leaf className="h-3 w-3" /> Browse Products
              </Link>
              <Link href="/faqs" className="text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1">
                <Leaf className="h-3 w-3" /> FAQs
              </Link>
              <Link href="/tracking" className="text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1">
                <Leaf className="h-3 w-3" /> Track Order
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
