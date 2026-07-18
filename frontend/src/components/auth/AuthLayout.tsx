'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  alternateLink: {
    label: string;
    href: string;
    text: string;
  };
}

export function AuthLayout({ children, title, subtitle, alternateLink }: AuthLayoutProps) {
  return (
    <div className="flex min-h-0 flex-1 w-full">
      {/* Left - Auth Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                <span className="text-lg font-bold text-white">EN</span>
              </div>
              <span className="text-2xl font-bold gradient-text">{APP_NAME}</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-bold text-gray-900"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-sm text-gray-600"
            >
              {subtitle}
            </motion.p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {children}
          </motion.div>

          {/* Alternate Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center text-sm text-gray-600"
          >
            {alternateLink.text}{' '}
            <Link
              href={alternateLink.href}
              className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
            >
              {alternateLink.label}
            </Link>
          </motion.p>
        </div>
      </div>

      {/* Right - Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full border-[30px] border-white" />
          <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full border-[40px] border-white" />
          <div className="absolute top-1/3 left-1/4 h-48 w-48 rounded-full border-[15px] border-white" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              Premium Shopping Experience
            </h2>
            <p className="text-lg text-white/80 max-w-md">
              Discover thousands of premium products at unbeatable prices. 
              Fast shipping, easy returns, and dedicated support.
            </p>

            <div className="mt-12 space-y-4">
              {[
                { icon: '🚚', text: 'Free delivery on orders above ₹499' },
                { icon: '🔒', text: '100% secure payment gateway' },
                { icon: '↩️', text: '30-day hassle-free returns' },
                { icon: '💬', text: '24/7 customer support' },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 text-white/80"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
