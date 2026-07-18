'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShoppingBag, Package, Users, Tags, 
  BarChart3, Settings, Bell, FileText, Percent,
  Image, Store, Star, Ticket, Truck, GraduationCap,
  LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  onMobileClose?: () => void;
}

const sidebarLinks = [
  { section: 'Main', items: [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ]},
  { section: 'Products', items: [
    { label: 'All Products', href: '/admin/products', icon: ShoppingBag },
    { label: 'Categories', href: '/admin/categories', icon: Tags },
    { label: 'Brands', href: '/admin/brands', icon: Store },
    { label: 'Reviews', href: '/admin/reviews', icon: Star },
  ]},
  { section: 'Orders', items: [
    { label: 'All Orders', href: '/admin/orders', icon: Package },
    { label: 'Shipments', href: '/admin/shipments', icon: Truck },
    { label: 'Returns', href: '/admin/returns', icon: Ticket },
  ]},
  { section: 'Users', items: [
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Staff', href: '/admin/staff', icon: GraduationCap },
  ]},
  { section: 'Marketing', items: [
    { label: 'Coupons', href: '/admin/coupons', icon: Percent },
    { label: 'Banners', href: '/admin/banners', icon: Image },
    { label: 'Notifications', href: '/admin/notifications', icon: Bell },
  ]},
  { section: 'Other', items: [
    { label: 'Reports', href: '/admin/reports', icon: FileText },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ]},
];

export function Sidebar({ isCollapsed = false, onToggle, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  const handleNavClick = () => {
    onMobileClose?.();
  };

  return (
    <aside className={cn(
      'flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-all duration-300',
      isCollapsed ? 'lg:w-16' : 'lg:w-64',
      'w-64' // Always full width on mobile
    )}>
      {/* Logo */}
      <div className={cn(
        'flex h-16 items-center border-b border-gray-200 px-4',
        isCollapsed ? 'justify-center' : 'justify-between'
      )}>
        {!isCollapsed && (
          <Link href="/admin/dashboard" className="text-lg font-bold gradient-text">
            {APP_NAME}
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={onToggle}>
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-6">
          {sidebarLinks.map((section) => (
            <div key={section.section}>
              {!isCollapsed && (
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {section.section}
                </p>
              )}
              <div className="space-y-1">
        {section.items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Logout */}
      <div className={cn(
        'border-t border-gray-200 p-2',
        isCollapsed && 'flex justify-center'
      )}>
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700',
            isCollapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
}
