'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
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
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700 shadow-md shadow-primary-700/20">
                <Leaf className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-heading text-noble-900 leading-none">{APP_NAME}</span>
                <span className="text-[10px] font-medium text-primary-600 uppercase tracking-[0.15em] leading-none mt-0.5">
                  Pure & Natural
                </span>
              </div>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-heading text-noble-900"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-2.5 text-sm text-noble-500"
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
            className="mt-8 text-center text-sm text-noble-500"
          >
            {alternateLink.text}{' '}
            <Link
              href={alternateLink.href}
              className="font-semibold text-primary-700 hover:text-primary-800 transition-colors"
            >
              {alternateLink.label}
            </Link>
          </motion.p>
        </div>
      </div>

      {/* Right - Visual Section (earthy, natural brand feel) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-noble-800 via-noble-900 to-primary-900">
        {/* Decorative circles */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full border-[30px] border-white" />
          <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full border-[40px] border-white" />
          <div className="absolute top-1/3 left-1/4 h-48 w-48 rounded-full border-[15px] border-white" />
        </div>

        {/* Subtle grain texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Icon */}
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <Leaf className="h-10 w-10 text-primary-300" strokeWidth={1.5} />
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-heading text-white mb-4">
              Pure & Natural Shopping
            </h2>
            <p className="text-lg text-white/50 max-w-md leading-relaxed">
              Discover premium natural foods sourced directly from farms, forests, and tribal communities across India.
            </p>

            {/* Trust points */}
            <div className="mt-12 space-y-4">
              {[
                { icon: '🌿', text: '100% natural & chemical-free products' },
                { icon: '🚚', text: 'Free delivery on orders above ₹499' },
                { icon: '🔒', text: 'Secure payments & data protection' },
                { icon: '↩️', text: '30-day hassle-free returns' },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 text-white/50"
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
