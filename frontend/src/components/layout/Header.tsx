'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';import { Search, ShoppingBag, User, Menu, Heart, ChevronDown, Store, Leaf,
  Package, Wheat, Droplets, Flame, Coffee, UtensilsCrossed, X, Flower2,
  LogOut, Settings, UserCircle,
  Package as PackageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, getInitials } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import dynamic from 'next/dynamic';

const SignInButton = () => (
  <span className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
    <User className="h-4 w-4" /> Sign In
  </span>
);

const UserMenuDesktop = dynamic(() => import('./UserMenu').then(m => ({ default: m.UserMenuDesktop })), { ssr: false, loading: SignInButton });
const UserMenuMobile = dynamic(() => import('./UserMenu').then(m => ({ default: m.UserMenuMobile })), { ssr: false });
const UserMenuMobileDrawer = dynamic(() => import('./UserMenu').then(m => ({ default: m.UserMenuMobileDrawer })), { ssr: false });

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Categories',
    href: '/categories',
    hasDropdown: true,
    megaItems: [
      {
        title: 'Natural Honey',
        href: '/products?category=honey',
        icon: Droplets,
        desc: 'Pure forest honey from tribal harvesters',
        color: 'text-amber-500',
        bgColor: 'bg-amber-50 dark:bg-amber-950/30',
      },
      {
        title: 'Millets & Grains',
        href: '/products?category=millets',
        icon: Wheat,
        desc: 'Organic millets, rice & ancient grains',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
      },
      {
        title: 'Cold Pressed Oils',
        href: '/products?category=oils',
        icon: Droplets,
        desc: 'Wood-pressed, chemical-free oils',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
      },
      {
        title: 'Natural Spices',
        href: '/products?category=spices',
        icon: Flame,
        desc: 'Premium spices from hill regions',
        color: 'text-red-500',
        bgColor: 'bg-red-50 dark:bg-red-950/30',
      },
      {
        title: 'A2 Ghee & Dairy',
        href: '/products?category=ghee',
        icon: Coffee,
        desc: 'Bilona method A2 desi cow ghee',
        color: 'text-orange-500',
        bgColor: 'bg-orange-50 dark:bg-orange-950/30',
      },
      {
        title: 'Herbal & Wellness',
        href: '/products?category=herbal',
        icon: Leaf,
        desc: 'Organic teas, herbs & wellness',
        color: 'text-teal-500',
        bgColor: 'bg-teal-50 dark:bg-teal-950/30',
      },
      {
        title: 'Pickles & Snacks',
        href: '/products?category=pickles',
        icon: UtensilsCrossed,
        desc: 'Homemade pickles & traditional snacks',
        color: 'text-rose-500',
        bgColor: 'bg-rose-50 dark:bg-rose-950/30',
      },
      {
        title: 'All Products',
        href: '/products',
        icon: Package,
        desc: 'Browse our complete collection',
        color: 'text-primary-500',
        bgColor: 'bg-primary-50 dark:bg-primary-950/30',
      },
    ],
  },
  { label: 'Organic', href: '/products?category=organic' },
  {
    label: 'Shop',
    hasDropdown: true,
    children: [
      { label: 'New Arrivals', href: '/products?sort=newest' },
      { label: 'Best Sellers', href: '/products?sort=bestsellers' },
      { label: 'Today\'s Deals', href: '/products?sort=discount' },
      { label: 'Gift Boxes', href: '/products?category=gifts' },
    ],
  },
  { label: 'Our Story', href: '/about' },
  { label: 'Farmers', href: '/farmers' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const categoryIcons: Record<string, React.ReactNode> = {
  honey: <Droplets className="h-5 w-5" />,
  millets: <Wheat className="h-5 w-5" />,
  oils: <Droplets className="h-5 w-5" />,
  spices: <Flame className="h-5 w-5" />,
  ghee: <Coffee className="h-5 w-5" />,
  herbal: <Leaf className="h-5 w-5" />,
  pickles: <UtensilsCrossed className="h-5 w-5" />,
};

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  const router = useRouter();
  const dispatch = useAppDispatch();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 40);
  });

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const cartCount = useAppSelector((state) => state.cart.items.length);

  const headerVariants = {
    top: {
      background: 'rgba(255, 255, 255, 1)',
      backdropFilter: 'none',
      borderColor: 'rgba(229, 231, 235, 1)',
      height: '5rem',
    },
    scrolled: {
      background: 'rgba(255, 255, 255, 1)',
      backdropFilter: 'none',
      borderColor: 'rgba(229, 231, 235, 1)',
      height: '4rem',
    },
  };

  return (
    <>
      <motion.header
        variants={headerVariants}
        animate={isScrolled ? 'scrolled' : 'top'}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cn(
          'website-header fixed top-0 left-0 right-0 z-50 border-b transition-shadow',
          isScrolled ? 'shadow-lg shadow-black/5' : 'shadow-none',
        )}
      >
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-200/50 group-hover:shadow-primary-300/50 transition-shadow">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-emerald-900 dark:text-white">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 h-full">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative h-full flex items-center"
                onMouseEnter={() => link.hasDropdown && setActiveMega(link.label)}
                onMouseLeave={() => setActiveMega(null)}
              >
                {link.hasDropdown ? (
                  <button
                    className={cn(
                      'flex items-center gap-1 px-3.5 h-full text-sm font-medium transition-colors',
                      'hover:text-primary-600 dark:hover:text-primary-400',
                      activeMega === link.label
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-noble-700 dark:text-noble-300'
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform duration-200',
                        activeMega === link.label && 'rotate-180'
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={link.href!}
                    className="flex items-center gap-1 px-3.5 h-full text-sm font-medium text-noble-700 dark:text-noble-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                )}

                {/* Mega Menu Dropdown */}
                <AnimatePresence>
                  {link.hasDropdown && activeMega === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute top-full left-0 mt-0 pt-2"
                      onMouseEnter={() => setActiveMega(link.label)}
                      onMouseLeave={() => setActiveMega(null)}
                    >
                      <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 border border-primary-100/50 overflow-hidden p-5 min-w-[600px]">
                        {link.megaItems ? (
                          <div className="grid grid-cols-2 gap-2">
                            {link.megaItems.map((item) => (
                              <Link
                                key={item.title}
                                href={item.href}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary-50/70 dark:hover:bg-primary-950/30 transition-all group/item"
                              >
                                <div className={cn(
                                  'p-2.5 rounded-xl shrink-0 transition-colors',
                                  item.bgColor
                                )}>
                                  <item.icon className={cn('h-5 w-5', item.color)} />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-noble-800 dark:text-noble-200 group-hover/item:text-primary-600 transition-colors">
                                    {item.title}
                                  </p>
                                  <p className="text-xs text-noble-400 mt-0.5">{item.desc}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1 min-w-[200px]">
                            {link.children?.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                className="px-3.5 py-2.5 text-sm font-medium text-noble-700 dark:text-noble-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 rounded-xl transition-all"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-xl hover:bg-noble-100 dark:hover:bg-noble-800 transition-colors text-noble-500 hover:text-noble-700"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2.5 rounded-xl hover:bg-noble-100 dark:hover:bg-noble-800 transition-colors text-noble-500 hover:text-noble-700 hidden sm:block"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Auth Section - Desktop (client-only) */}
            <div className="hidden sm:block">
              <UserMenuDesktop />
            </div>

            {/* Account Icon - Mobile (client-only) */}
            <UserMenuMobile />

            {/* Cart */}
            <Link href="/cart" className="relative p-2.5 rounded-xl hover:bg-noble-100 dark:hover:bg-noble-800 transition-colors text-noble-500 hover:text-noble-700">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 p-0 flex items-center justify-center bg-primary-500 text-white text-[10px] font-bold border-2 border-white dark:border-noble-900 rounded-full">
                  {cartCount}
                </Badge>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-noble-100 dark:hover:bg-noble-800 transition-colors text-noble-500"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl mx-auto mt-24 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl p-2 shadow-2xl">
                <div className="flex items-center gap-3 px-4">
                  <Search className="h-5 w-5 text-noble-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search organic honey, millets, oils..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="flex-1 bg-transparent border-0 outline-none text-base text-noble-800 dark:text-noble-200 placeholder:text-noble-400 py-3.5"
                  />
                  <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-noble-400 bg-noble-100 dark:bg-noble-800 rounded-lg">
                    <span>⌘</span>K
                  </kbd>
                </div>
              </div>

              {/* Search Suggestions */}
              <div className="mt-4 bg-white rounded-2xl p-5 shadow-xl">
                <p className="text-xs font-semibold text-noble-400 uppercase tracking-wider mb-3">
                  Popular Categories
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Honey', 'Millets', 'Oils', 'Spices', 'Ghee', 'Tea', 'Pickles', 'Jaggery'].map((cat) => (
                    <Link
                      key={cat}
                      href={`/products?category=${cat.toLowerCase()}`}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors group"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <span className="text-noble-400">{categoryIcons[cat.toLowerCase()] || <Package className="h-4 w-4" />}</span>
                      <span className="text-sm font-medium text-noble-700 dark:text-noble-300 group-hover:text-primary-600 transition-colors">
                        {cat}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-noble-900 shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pt-20">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      <Link
                        href={link.href ?? '#'}
                        className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/30 text-noble-700 dark:text-noble-300 font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                      {link.megaItems && (
                        <div className="ml-4 mt-1 mb-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {link.megaItems.map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              className="flex items-center gap-2.5 py-2 px-3 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <item.icon className={cn('h-4 w-4', item.color)} />
                              <span className="text-xs font-medium text-noble-600 dark:text-noble-400">{item.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                      {link.children && (
                        <div className="ml-4 mt-1 mb-2 flex flex-col gap-0.5">
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="py-2 px-4 text-sm text-noble-500 dark:text-noble-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-noble-200 dark:border-noble-700 px-2">
                  <UserMenuMobileDrawer />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className={cn('website-header', isScrolled ? 'h-16' : 'h-20')} />
    </>
  );
}
