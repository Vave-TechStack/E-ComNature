'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, MapPin, Package, Heart, CreditCard, Award, Bell, Settings, ChevronRight, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, getInitials } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

const profileLinks = [
  { label: 'My Profile', href: '/profile', icon: User },
  { label: 'Addresses', href: '/profile/addresses', icon: MapPin },
  { label: 'Orders', href: '/profile/orders', icon: Package },
  { label: 'Wishlist', href: '/profile/wishlist', icon: Heart },
  { label: 'Payments', href: '/profile/payments', icon: CreditCard },
  { label: 'Rewards', href: '/profile/rewards', icon: Award },
  { label: 'Notifications', href: '/profile/notifications', icon: Bell },
  { label: 'Settings', href: '/profile/settings', icon: Settings },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="container-custom py-6">
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your profile, orders, and preferences</p>
        </div>
      </div>
      <div className="container-custom py-6">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20">
              <div className="text-center mb-4">
                <Avatar className="mx-auto h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary-100 text-primary-700 text-lg">{getInitials('Rajesh Kumar')}</AvatarFallback>
                </Avatar>
                <p className="mt-2 font-semibold text-gray-900">Rajesh Kumar</p>
                <p className="text-xs text-gray-500">rajesh@email.com</p>
              </div>
              <nav className="space-y-1">
                {profileLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden w-full mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {profileLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors',
                      isActive ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
