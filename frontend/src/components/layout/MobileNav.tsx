'use client';

import { useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { usePageCategory } from '@/lib/contexts/PageCategoryContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, User, Package, HelpCircle, LogOut, Tag, Sparkles, TrendingUp, Star, Leaf, MapPin, ChevronRight, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setMobileMenuOpen } from '@/store/slices/uiSlice';

const categoryLinks = [
  { label: 'All Products', href: '/products', icon: ShoppingBag, color: 'text-primary-600' },
  { label: 'Natural Honey', href: '/products?category=honey', icon: Sparkles, color: 'text-amber-500' },
  { label: 'Millets & Grains', href: '/products?category=millets', icon: Tag, color: 'text-yellow-600' },
  { label: 'Cold Pressed Oils', href: '/products?category=oils', icon: TrendingUp, color: 'text-green-600' },
  { label: 'Natural Spices', href: '/products?category=spices', icon: Star, color: 'text-red-500' },
  { label: 'A2 Ghee & Dairy', href: '/products?category=ghee', icon: Leaf, color: 'text-orange-500' },
  { label: 'Organic Collection', href: '/products?category=organic', icon: Leaf, color: 'text-emerald-600' },
  { label: 'Herbal Products', href: '/products?category=herbal', icon: Leaf, color: 'text-teal-500' },
];

const accountLinks = [
  { label: 'My Account', href: '/profile', icon: User },
  { label: 'My Orders', href: '/orders', icon: Package },
  { label: 'Wishlist', href: '/wishlist', icon: Heart },
  { label: 'Help & Support', href: '/support', icon: HelpCircle },
];

// Lock body scroll when menu is open
function useLockBodyScroll(isOpen: boolean) {
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalWidth = document.body.style.width;
      const originalTop = document.body.style.top;
      const scrollY = window.scrollY;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = originalWidth;
        document.body.style.top = originalTop;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);
}

const drawerVariants = {
  closed: {
    x: '-100%',
  },
  open: {
    x: 0,
  },
};

const drawerTransition = {
  type: 'spring' as const,
  damping: 30,
  stiffness: 300,
};

const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const overlayTransition = { duration: 0.2 };

export function MobileNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { categorySlug: productCategorySlug } = usePageCategory();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);

  useLockBodyScroll(isOpen);

  const handleClose = useCallback(() => {
    dispatch(setMobileMenuOpen(false));
  }, [dispatch]);

  const handleLinkClick = useCallback(() => {
    dispatch(setMobileMenuOpen(false));
  }, [dispatch]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop with backdrop-blur only on the overlay, not the menu */}
          <motion.div
            key="mobile-overlay"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={overlayTransition}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Drawer - solid white background, no transparency */}
          <motion.div
            key="mobile-drawer"
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={drawerTransition}
            className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-2xl z-[101]"
            style={{
              paddingTop: 'env(safe-area-inset-top, 0px)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
          >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-primary-100 px-4 safe-area-top">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary shadow-sm">
                  <span className="text-sm font-bold text-white">NK</span>
                </div>
                <div>
                  <span className="text-base font-bold gradient-text">{APP_NAME}</span>
                  <span className="text-[9px] text-primary-500 font-medium uppercase tracking-wider block -mt-0.5">Pure & Natural Foods</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full h-9 w-9"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <ScrollArea className="h-[calc(100vh-4rem)]">
              <div className="px-4 py-5">
                {/* Location */}
                <div className="mb-5 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary-50 border border-primary-100">
                  <MapPin className="h-4 w-4 text-accent-600" />
                  <span className="text-xs font-medium text-primary-800">Delivering to: <span className="font-semibold">Bangalore</span></span>
                  <ChevronRight className="h-3.5 w-3.5 text-primary-400 ml-auto" />
                </div>

                {/* Auth Section */}
                <div className="mb-5 rounded-xl bg-gradient-to-br from-primary-50 via-white to-accent-50 border border-primary-100 p-4">
                  <p className="text-xs text-gray-600 mb-1">Welcome to NatureKart!</p>
                  <p className="text-sm font-semibold text-primary-800 mb-3">Get 10% off on your first order</p>
                  <div className="flex gap-2">
                    <Link href="/auth/login" className="flex-1" onClick={handleLinkClick}>
                      <Button size="sm" variant="outline" className="w-full border-primary-300 text-primary-700 hover:bg-primary-50 text-xs font-semibold">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" className="flex-1" onClick={handleLinkClick}>
                      <Button size="sm" className="w-full gradient-primary text-white text-xs font-semibold shadow-sm shadow-primary-200">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Shop Categories */}
                <div className="mb-4">
                  <p className="px-3 text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">
                    Shop Categories
                  </p>
                  <div className="space-y-0.5">                        {categoryLinks.map((link) => {
                      const Icon = link.icon;
                      // Parse query params from href for active matching
                      const linkQuery = link.href.split('?')[1] || '';
                      const linkParams = new URLSearchParams(linkQuery);
                      const onProductPage = productCategorySlug && pathname.startsWith('/products/');
                      const isActive = linkParams.has('category')
                        ? onProductPage
                          ? productCategorySlug === linkParams.get('category')
                          : pathname === '/products' && searchParams.get('category') === linkParams.get('category')
                        : pathname === link.href && !searchParams.get('category') && !onProductPage;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={handleLinkClick}
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
                            isActive
                              ? 'bg-primary-50 text-primary-700 border border-primary-100'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                          )}
                        >
                          <Icon className={cn('h-5 w-5', link.color)} />
                          <span>{link.label}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-gray-300 ml-auto" />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <Separator className="my-4 bg-primary-100" />

                {/* Account */}
                <div className="mb-4">
                  <p className="px-3 text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">
                    Account
                  </p>
                  <div className="space-y-0.5">
                    {accountLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-primary-600"
                        >
                          <Icon className="h-5 w-5 text-gray-400" />
                          <span>{link.label}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-gray-300 ml-auto" />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <Separator className="my-4 bg-primary-100" />

                {/* Contact & Support */}
                <div className="px-3 space-y-2 mb-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-primary-500" />
                    <span>+91 1800-123-8900</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-primary-500" />
                    <span>hello@naturekart.in</span>
                  </div>
                </div>

                {/* Sign Out */}
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50">
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>

                {/* Footer spacer for safe-area */}
                <div className="h-8" />
              </div>
            </ScrollArea>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
