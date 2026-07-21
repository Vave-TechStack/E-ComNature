'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  User, MapPin, Package, Heart, CreditCard, Award,
  Bell, Settings, LogOut, ChevronRight, Wallet,
  ShoppingBag, Gift, HelpCircle, ShieldCheck
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const profileLinks = [
  { label: 'My Profile', href: '/profile', icon: User, desc: 'Personal info & security' },
  { label: 'My Orders', href: '/profile/orders', icon: Package, desc: 'Track & manage orders' },
  { label: 'Wishlist', href: '/profile/wishlist', icon: Heart, desc: 'Saved items' },
  { label: 'Addresses', href: '/profile/addresses', icon: MapPin, desc: 'Delivery addresses' },
  { label: 'Payments', href: '/profile/payments', icon: CreditCard, desc: 'Cards & UPI' },
  { label: 'Rewards & Points', href: '/profile/rewards', icon: Award, desc: 'Earn & redeem points' },
  { label: 'Notifications', href: '/profile/notifications', icon: Bell, desc: 'Alerts & preferences' },
  { label: 'Settings', href: '/profile/settings', icon: Settings, desc: 'Account settings' },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const displayName = user
    ? (user.displayName || `${user.firstName} ${user.lastName}`.trim())
    : 'Guest';
  const initials = user ? getInitials(displayName) : 'G';

  const links = user?.role === 'ROLE_ADMIN'
    ? [
        { label: 'Admin Dashboard', href: '/admin/dashboard', icon: ShieldCheck, desc: 'Manage store & settings' },
        ...profileLinks,
      ]
    : profileLinks;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Amazon-style top banner */}
      <div className="bg-gradient-to-r from-[#131921] to-[#1a2a35] text-white">
        <div className="container-custom flex items-center gap-4 py-4">
          <Avatar className="h-14 w-14 ring-2 ring-emerald-400/50 ring-offset-2 ring-offset-[#131921]">
            <AvatarImage src={user?.profileImage || ''} />
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-600 text-white text-lg font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-white/50 font-medium">Welcome back,</p>
            <h1 className="text-xl font-bold text-white">{displayName}</h1>
            <div className="flex items-center gap-3 mt-1">
              {user?.email && (
                <span className="text-xs text-white/50">{user.email}</span>
              )}
              {user?.role && (
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-[10px] px-2 py-0 h-4">
                  {user.role === 'ROLE_ADMIN' ? 'Admin' : 'Customer'}
                </Badge>
              )}
            </div>
          </div>
          {/* Quick stats */}
          {user && (
            <div className="ml-auto hidden sm:flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Award className="h-4 w-4" />
                  <span className="text-lg font-bold">{user.rewardPoints?.toLocaleString() ?? 0}</span>
                </div>
                <p className="text-[10px] text-white/40 mt-0.5">Reward Points</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Wallet className="h-4 w-4" />
                  <span className="text-lg font-bold">₹{user.walletBalance?.toLocaleString() ?? 0}</span>
                </div>
                <p className="text-[10px] text-white/40 mt-0.5">Wallet Balance</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile quick stats */}
      {user && (
        <div className="sm:hidden bg-[#1a2a35] px-4 pb-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Award className="h-4 w-4" />
            <span className="text-sm font-bold text-white">{user.rewardPoints?.toLocaleString() ?? 0} pts</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-bold text-white">₹{user.walletBalance?.toLocaleString() ?? 0}</span>
          </div>
        </div>
      )}

      {/* Mobile horizontal scroll nav */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="flex gap-1 overflow-x-auto pb-0 px-3 pt-2 scrollbar-hide">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href === '/admin/dashboard' && pathname.startsWith('/admin'));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all mb-2',
                  isActive
                    ? 'bg-[#131921] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="flex gap-6">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <nav className="p-2">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || (link.href === '/admin/dashboard' && pathname.startsWith('/admin'));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-3 transition-all group',
                        isActive
                          ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg shrink-0 transition-colors',
                        isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn('text-sm font-semibold truncate', isActive ? 'text-emerald-800' : '')}>
                          {link.label}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">{link.desc}</p>
                      </div>
                      <ChevronRight className={cn(
                        'h-3.5 w-3.5 shrink-0 transition-colors',
                        isActive ? 'text-emerald-500' : 'text-gray-300 group-hover:text-gray-400'
                      )} />
                    </Link>
                  );
                })}
              </nav>

              {/* Divider */}
              <div className="mx-4 border-t border-gray-100" />

              {/* Logout */}
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-red-500 hover:bg-red-50 transition-colors group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-400 group-hover:bg-red-100 transition-colors shrink-0">
                    <LogOut className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Sign Out</p>
                    <p className="text-[11px] text-red-400/70">Log out of your account</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Help card */}
            <div className="mt-3 rounded-2xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="h-4 w-4 text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-800">Need Help?</p>
              </div>
              <p className="text-xs text-emerald-700/70 mb-3">
                Our support team is here 24/7 to assist you.
              </p>
              <Link
                href="/support"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
