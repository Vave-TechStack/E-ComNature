'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Shop', href: '/products', icon: Search },
  { label: 'Cart', href: '/cart', icon: ShoppingBag, showBadge: true },
  { label: 'Wishlist', href: '/wishlist', icon: Heart },
  { label: 'Account', href: '/profile', icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const cartCount = useAppSelector((state) => state.cart.items.length);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling down a bit, hide at the very top
      setIsVisible(window.scrollY > 100);
    };
    // Always show on mobile
    setIsVisible(true);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show on admin pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/checkout')) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden safe-area-bottom">
      {/* Gradient border top */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />

      <nav className="bg-white/95 backdrop-blur-xl border-t border-noble-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href ||
              (item.href === '/products' && pathname.startsWith('/products')) ||
              (item.href === '/profile' && pathname.startsWith('/profile')) ||
              (item.href === '/wishlist' && pathname.startsWith('/wishlist'));
            const isCart = item.showBadge && cartCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 min-w-[56px]',
                  isActive
                    ? 'text-primary-700'
                    : 'text-noble-400 hover:text-noble-600'
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <div className="relative">
                  <Icon className={cn(
                    'h-5 w-5 transition-all duration-200',
                    isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'
                  )} />

                  {/* Cart Badge */}
                  {isCart && (
                    <span className="absolute -top-1.5 -right-2 h-4 w-4 flex items-center justify-center bg-primary-600 text-white text-[9px] font-bold rounded-full border border-white">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>

                <span className={cn(
                  'text-[10px] font-medium transition-all duration-200',
                  isActive ? 'text-primary-700' : ''
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
