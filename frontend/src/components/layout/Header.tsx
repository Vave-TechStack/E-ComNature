'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import {
  Search, ShoppingBag, User, Menu, Heart, ChevronDown, Store, Leaf,
  Package, Wheat, Droplets, Flame, Coffee, UtensilsCrossed, X, Flower2,
  LogOut, Settings, UserCircle, Truck, Shield, Sparkles, Phone, MapPin,
  ChevronRight, ArrowRight,
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
  <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">
    <User className="h-4 w-4" /> Sign In
  </span>
);

const UserMenuDesktop = dynamic(() => import('./UserMenu').then(m => ({ default: m.UserMenuDesktop })), { ssr: false, loading: SignInButton });
const UserMenuMobile = dynamic(() => import('./UserMenu').then(m => ({ default: m.UserMenuMobile })), { ssr: false });
const UserMenuMobileDrawer = dynamic(() => import('./UserMenu').then(m => ({ default: m.UserMenuMobileDrawer })), { ssr: false });

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Shop',
    href: '/categories',
    hasDropdown: true,
    megaItems: [
      {
        title: 'Natural Honey',
        href: '/products?category=honey',
        icon: Droplets,
        desc: 'Pure forest honey from tribal harvesters',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
      },
      {
        title: 'Millets & Grains',
        href: '/products?category=millets',
        icon: Wheat,
        desc: 'Organic millets, rice & ancient grains',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50',
      },
      {
        title: 'Cold Pressed Oils',
        href: '/products?category=oils',
        icon: Droplets,
        desc: 'Wood-pressed, chemical-free oils',
        color: 'text-primary-600',
        bgColor: 'bg-primary-50',
      },
      {
        title: 'Natural Spices',
        href: '/products?category=spices',
        icon: Flame,
        desc: 'Premium spices from hill regions',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
      },
      {
        title: 'A2 Ghee & Dairy',
        href: '/products?category=ghee',
        icon: Coffee,
        desc: 'Bilona method A2 desi cow ghee',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
      },
      {
        title: 'Herbal & Wellness',
        href: '/products?category=herbal',
        icon: Leaf,
        desc: 'Organic teas, herbs & wellness',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
      },
      {
        title: 'Pickles & Snacks',
        href: '/products?category=pickles',
        icon: UtensilsCrossed,
        desc: 'Homemade pickles & traditional snacks',
        color: 'text-rose-600',
        bgColor: 'bg-rose-50',
      },
      {
        title: 'All Products',
        href: '/products',
        icon: Package,
        desc: 'Browse our complete collection',
        color: 'text-primary-500',
        bgColor: 'bg-primary-50',
      },
    ],
  },
  { label: 'Organic', href: '/products?category=organic' },
  {
    label: 'Collections',
    hasDropdown: true,
    children: [
      { label: 'New Arrivals', href: '/products?sort=newest' },
      { label: 'Best Sellers', href: '/products?sort=bestsellers' },
      { label: "Today's Deals", href: '/products?sort=discount' },
      { label: 'Gift Boxes', href: '/products?category=gifts' },
    ],
  },
  { label: 'Our Story', href: '/about' },
  { label: 'Blog', href: '/blog' },
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

/* ===================== ANNOUNCEMENT BAR ===================== */
function AnnouncementBar() {
  const items = [
    { icon: Leaf, text: '100% Natural & Chemical-Free Products' },
    { icon: Truck, text: 'Free Shipping on Orders Above ₹499' },
    { icon: Shield, text: 'Authenticity Guaranteed — Direct from Farms' },
    { icon: Sparkles, text: 'New Arrivals: Organic Jaggery & Herbal Teas' },
  ];

  return (
    <div className="announcement-bar relative bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 text-white overflow-hidden">
      <div className="flex items-center justify-center h-9 text-xs font-medium tracking-wide">
        <div className="announcement-marquee whitespace-nowrap">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 mx-8">
              <item.icon className="h-3 w-3 text-accent-400" />
              <span>{item.text}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===================== HEADER ===================== */
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
      background: 'rgba(250, 249, 246, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottomColor: 'rgba(61, 122, 61, 0.08)',
      height: '5rem',
    },
    scrolled: {
      background: 'rgba(250, 249, 246, 0.98)',
      backdropFilter: 'blur(16px)',
      borderBottomColor: 'rgba(61, 122, 61, 0.1)',
      height: '4rem',
    },
  };

  return (
    <>
      <AnnouncementBar />

      <motion.header
        variants={headerVariants}
        animate={isScrolled ? 'scrolled' : 'top'}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cn(
          'website-header fixed top-0 left-0 right-0 z-50 border-b transition-shadow',
          isScrolled ? 'shadow-md shadow-black/[0.04]' : 'shadow-none',
        )}
        style={{ top: isScrolled ? 0 : 0 }}
      >
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-md shadow-primary-800/20 group-hover:shadow-lg group-hover:shadow-primary-800/30 transition-shadow">
              <Leaf className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-heading font-normal tracking-tight text-noble-900 leading-none">
                {APP_NAME}
              </span>
              <span className="text-[10px] font-medium text-primary-600 uppercase tracking-[0.15em] leading-none mt-0.5">
                Pure & Natural
              </span>
            </div>
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
                      'hover:text-primary-700',
                      activeMega === link.label
                        ? 'text-primary-700'
                        : 'text-noble-600'
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
                    className="flex items-center gap-1 px-3.5 h-full text-sm font-medium text-noble-600 hover:text-primary-700 transition-colors"
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
                      <div className="bg-white rounded-2xl shadow-2xl shadow-noble-900/10 border border-noble-100 overflow-hidden p-5 min-w-[600px]">
                        {link.megaItems ? (
                          <div className="grid grid-cols-2 gap-2">
                            {link.megaItems.map((item) => (
                              <Link
                                key={item.title}
                                href={item.href}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary-50 transition-all group/item"
                              >
                                <div className={cn(
                                  'p-2.5 rounded-xl shrink-0 transition-colors',
                                  item.bgColor
                                )}>
                                  <item.icon className={cn('h-5 w-5', item.color)} />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-noble-800 group-hover/item:text-primary-700 transition-colors">
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
                                className="px-3.5 py-2.5 text-sm font-medium text-noble-600 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all"
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
          <div className="flex items-center gap-1.5">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-xl hover:bg-noble-100 transition-colors text-noble-500 hover:text-noble-700"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2.5 rounded-xl hover:bg-noble-100 transition-colors text-noble-500 hover:text-noble-700 hidden sm:block"
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
            <Link href="/cart" className="relative p-2.5 rounded-xl hover:bg-noble-100 transition-colors text-noble-500 hover:text-noble-700">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 p-0 flex items-center justify-center bg-primary-600 text-white text-[10px] font-bold border-2 border-white rounded-full">
                  {cartCount}
                </Badge>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-noble-100 transition-colors text-noble-500"
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
            className="fixed inset-0 z-[60] bg-noble-900/40 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl mx-auto mt-24 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl p-2 shadow-2xl border border-noble-100">
                <div className="flex items-center gap-3 px-4">
                  <Search className="h-5 w-5 text-noble-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search honey, millets, oils, spices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="flex-1 bg-transparent border-0 outline-none text-base text-noble-800 placeholder:text-noble-400 py-3.5"
                  />
                  <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-noble-400 bg-noble-100 rounded-lg">
                    <span>⌘</span>K
                  </kbd>
                </div>
              </div>

              {/* Search Suggestions */}
              <div className="mt-4 bg-white rounded-2xl p-5 shadow-xl border border-noble-100">
                <p className="text-xs font-semibold text-noble-400 uppercase tracking-wider mb-3">
                  Popular Categories
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Honey', 'Millets', 'Oils', 'Spices', 'Ghee', 'Tea', 'Pickles', 'Jaggery'].map((cat) => (
                    <Link
                      key={cat}
                      href={`/products?category=${cat.toLowerCase()}`}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-primary-50 transition-colors group"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <span className="text-noble-400">{categoryIcons[cat.toLowerCase()] || <Package className="h-4 w-4" />}</span>
                      <span className="text-sm font-medium text-noble-600 group-hover:text-primary-700 transition-colors">
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
            className="fixed inset-0 z-40 bg-noble-900/50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pt-20">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      <Link
                        href={link.href ?? '#'}
                        className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-primary-50 text-noble-700 font-medium transition-colors"
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
                              className="flex items-center gap-2.5 py-2 px-3 rounded-lg hover:bg-primary-50 transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <item.icon className={cn('h-4 w-4', item.color)} />
                              <span className="text-xs font-medium text-noble-500">{item.title}</span>
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
                              className="py-2 px-4 text-sm text-noble-500 hover:text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
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

                <div className="mt-6 pt-6 border-t border-noble-100 px-2">
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
