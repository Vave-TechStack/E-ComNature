'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, Leaf, Package, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { APP_NAME } from '@/lib/constants';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const suggestions = ['Forest Honey', 'Organic Millets', 'A2 Ghee', 'Cold Pressed Oil', 'Turmeric'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/30 via-white to-white flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-100/40 blur-3xl"
        style={{ transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)` }}
      />
      <div
        className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent-100/40 blur-3xl"
        style={{ transform: `translate(${-mousePosition.x * 20}px, ${-mousePosition.y * 20}px)` }}
      />

      <div className="container-custom py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-lg text-center"
        >
          {/* 404 Illustration */}
          <div className="relative mx-auto flex items-center justify-center mb-8">
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="flex h-40 w-40 items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary-400 to-primary-600 shadow-2xl shadow-primary-200">
                <span className="text-7xl font-black text-white">404</span>
              </div>
              {/* Floating elements */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg border border-primary-100"
              >
                <Leaf className="h-6 w-6 text-primary-500" />
              </motion.div>
              <motion.div
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-3 -left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg border border-accent-100"
              >
                <Sparkles className="h-5 w-5 text-accent-500" />
              </motion.div>
            </motion.div>
          </div>

          {/* Text */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Oops! This page seems to have&nbsp;
            <span className="gradient-text">wandered off</span>
          </h1>
          <p className="mt-4 text-gray-500 max-w-md mx-auto leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s help you find something natural instead!
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="mt-8 max-w-sm mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search natural products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 h-12 rounded-xl border-2 border-gray-200 bg-white text-sm focus:border-primary-400"
              />
            </div>
          </form>

          {/* Suggestions */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="text-xs text-gray-400 mr-1">Try:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => router.push(`/products?search=${encodeURIComponent(s)}`)}
                className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600 hover:bg-primary-100 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="outline"
              className="gap-2 border-gray-300 w-full sm:w-auto"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" /> Go Back
            </Button>
            <Link href="/products" className="w-full sm:w-auto">
              <Button className="w-full gap-2 gradient-primary shadow-lg shadow-primary-200">
                <Package className="h-4 w-4" /> Browse Products
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2 border-gray-300">
                <Home className="h-4 w-4" /> Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
