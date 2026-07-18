'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, User, Heart, Menu, X, ChevronDown, LogOut, Package, Settings, HelpCircle, MapPin, Leaf, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession, signOut } from 'next-auth/react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setMobileMenuOpen } from '@/store/slices/uiSlice';
import { APP_NAME } from '@/lib/constants';
import { cn, getInitials } from '@/lib/utils';
import { SearchDropdown, VoiceSearchButton, saveSearchHistory } from '@/components/search/SearchDropdown';


function UserDropdownMenu({ user: u, router }: { user: { image?: string | null; name?: string | null; email?: string | null }; router: ReturnType<typeof useRouter> }) {
  const displayName = u?.name || 'User';
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full cursor-pointer focus:outline-none data-open:opacity-80">
        <Avatar className="h-8 w-8 ring-2 ring-primary-200 ring-offset-2">
          {u?.image ? (
            <AvatarImage src={u.image} alt={displayName} />
          ) : (
            <AvatarFallback className="bg-primary-100 text-primary-800 text-xs font-semibold">{getInitials(displayName)}</AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2 border-primary-100">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-semibold">{displayName}</span>
              <span className="text-xs font-normal text-gray-500">{u?.email || ''}</span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
          <User className="mr-2 h-4 w-4 text-primary-600" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/orders')} className="cursor-pointer">
          <Package className="mr-2 h-4 w-4 text-primary-600" /> Orders
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/profile/addresses')} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4 text-primary-600" /> Addresses
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/support')} className="cursor-pointer">
          <HelpCircle className="mr-2 h-4 w-4 text-primary-600" /> Help
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="text-red-600 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const cartItemCount = useAppSelector((state) => state.cart.itemCount);

  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const user = session?.user || null;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value?: string) => {
    const q = (value || searchQuery).trim();
    if (q) {
      saveSearchHistory(q);
      router.push(`/products?search=${encodeURIComponent(q)}`);
      setSearchQuery('');
      setShowSuggestions(false);
      setIsSearchOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleVoiceResult = (text: string) => {
    setSearchQuery(text);
    handleSearch(text);
  };

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full transition-[background,box-shadow,border-color] duration-300',
      isScrolled
        ? 'bg-white shadow-md border-b border-primary-100'
        : 'bg-white/95 backdrop-blur-md border-b border-transparent'
    )}>
      {/* Top Bar - Offers strip */}
      <div className="hidden lg:block bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="container-custom flex items-center justify-between h-8">
          <div className="flex items-center gap-2 text-xs">
            <Leaf className="h-3 w-3 text-accent-400" />
            <span className="text-primary-100">Free Shipping on orders above ₹499</span>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <Link href="/support" className="text-primary-100 hover:text-white transition-colors">Help Center</Link>
            <Link href="/tracking" className="text-primary-100 hover:text-white transition-colors">Track Order</Link>
            <Link href="/returns" className="text-primary-100 hover:text-white transition-colors">Returns</Link>
            <div className="flex items-center gap-1 text-accent-400">
              <MapPin className="h-3 w-3" />
              <span className="text-accent-200">Deliver to: Bangalore</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={cn(isScrolled ? 'py-1' : 'py-0')}>
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-primary-200 group-hover:shadow-primary-300 transition-shadow">
                <span className="text-lg font-bold text-white tracking-tight">NK</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold gradient-text leading-tight block">
                  {APP_NAME}
                </span>
                <span className="text-[10px] text-primary-600 font-medium tracking-wider uppercase -mt-0.5 block">
                  Pure & Natural Foods
                </span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div ref={searchRef} className="hidden md:flex flex-1 max-w-2xl mx-4 relative">
              <form onSubmit={handleSubmit} className="relative w-full">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-400" />
                  <input
                    type="text"
                    placeholder='Search "Forest Honey", "Organic Millets", "Cold Pressed Oil"...'
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full h-11 pl-11 pr-28 rounded-xl border-2 border-primary-100 bg-primary-50/50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-400 focus:bg-white focus:shadow-lg focus:shadow-primary-100/50 transition-all"
                  />

                  {/* Voice Search */}
                  <VoiceSearchButton onResult={handleVoiceResult} />

                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 gradient-primary text-white px-4 rounded-lg h-8 hover:opacity-90 text-xs font-semibold"
                  >
                    Search
                  </Button>
                </div>
              </form>

              {/* Search Dropdown */}
              <AnimatePresence>
                {showSuggestions && (
                  <SearchDropdown
                    query={searchQuery}
                    onQueryChange={setSearchQuery}
                    onSubmit={handleSearch}
                    onClose={() => setShowSuggestions(false)}
                    isOpen={showSuggestions}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile Search */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Location - Desktop */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:flex gap-1.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50"
              >
                <MapPin className="h-4 w-4 text-accent-500" />
                <span className="text-xs font-medium">Bangalore</span>
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </Button>

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-red-500 hover:bg-red-50 hidden sm:flex">
                  <Heart className="h-5 w-5" />
                  <Badge variant="secondary" className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 text-[9px] bg-primary-500 text-white border-0">
                    0
                  </Badge>
                </Button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-primary-600 hover:bg-primary-50">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 text-[9px] bg-accent-500 text-white border-0">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              {isAuthenticated && user !== null ? (
                <UserDropdownMenu user={user} router={router} />
              ) : (
                <div className="hidden items-center gap-1 sm:flex ml-1">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 text-xs font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm" className="gradient-primary text-white text-xs font-semibold px-4 h-8 shadow-sm shadow-primary-200 hover:shadow-md hover:shadow-primary-300 transition-shadow">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-600 hover:text-primary-600 hover:bg-primary-50 ml-1"
                onClick={() => dispatch(setMobileMenuOpen(true))}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-primary-100 bg-white md:hidden"
            >
              <div className="container-custom py-3">
                <form onSubmit={handleSubmit}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-20 border-primary-100 bg-primary-50/50"
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (searchQuery.trim()) {
                            handleSearch(searchQuery);
                          }
                        }}
                        className="p-1.5 text-primary-500 hover:text-primary-700 transition-colors"
                        aria-label="Voice search"
                      >
                        <Mic className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                        className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </header>
  );
}
