'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShoppingBag, Package, Users, Tags,
  BarChart3, Settings, Bell, FileText, Percent,
  Image, Store, Star, Ticket, Truck, GraduationCap,
  LogOut, ChevronLeft, ChevronRight, Leaf, X
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';

export interface SidebarProps {
  /** Desktop: is the sidebar collapsed to icon-only (64px) */
  isCollapsed?: boolean;
  onToggle?: () => void;
  /** Mobile: is the drawer open */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const sidebarLinks = [
  {
    section: 'Main', items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ]
  },
  {
    section: 'Products', items: [
      { label: 'All Products', href: '/admin/products', icon: ShoppingBag },
      { label: 'Categories', href: '/admin/categories', icon: Tags },
      { label: 'Brands', href: '/admin/brands', icon: Store },
      { label: 'Reviews', href: '/admin/reviews', icon: Star },
    ]
  },
  {
    section: 'Orders', items: [
      { label: 'All Orders', href: '/admin/orders', icon: Package },
      { label: 'Shipments', href: '/admin/shipments', icon: Truck },
      { label: 'Returns', href: '/admin/returns', icon: Ticket },
    ]
  },
  {
    section: 'Users', items: [
      { label: 'Customers', href: '/admin/customers', icon: Users },
      { label: 'Staff', href: '/admin/staff', icon: GraduationCap },
    ]
  },
  {
    section: 'Marketing', items: [
      { label: 'Coupons', href: '/admin/coupons', icon: Percent },
      { label: 'Banners', href: '/admin/banners', icon: Image },
      { label: 'Notifications', href: '/admin/notifications', icon: Bell },
    ]
  },
  {
    section: 'Other', items: [
      { label: 'Reports', href: '/admin/reports', icon: FileText },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ]
  },
];

function getInitials(name: string) {
  return name.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

/** The actual sidebar panel — shared between mobile drawer & desktop fixed */
function SidebarPanel({
  isCollapsed,
  onToggle,
  onClose,
  showCloseButton,
}: {
  isCollapsed: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
}) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleNavClick = () => onClose?.();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <aside
      className={cn(
        'flex h-full flex-col',
        'bg-gradient-to-b from-noble-900 via-[#28251e] to-noble-900',
        'border-r border-white/[0.06]',
        'transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* ── Logo Header ── */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-white/10 px-3 gap-2',
          isCollapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {/* Logo */}
        <Link
          href="/admin/dashboard"
          onClick={handleNavClick}
          className={cn('flex items-center gap-2.5 min-w-0', isCollapsed && 'pointer-events-none')}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-700 shadow-lg shadow-black/30">
            <Leaf className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-heading text-white leading-tight truncate">{APP_NAME}</p>
              <p className="text-[10px] text-primary-400/60 font-semibold tracking-[0.15em] uppercase">Admin Panel</p>
            </div>
          )}
        </Link>

        {/* Mobile: close X | Desktop: collapse arrow */}
        {showCloseButton ? (
          <button
            onClick={onClose}
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          !isCollapsed && (
            <button
              onClick={onToggle}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-white/10 hover:text-white/80 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )
        )}
      </div>

      {/* Expand button (collapsed desktop only) */}
      {isCollapsed && !showCloseButton && (
        <button
          onClick={onToggle}
          className="mx-auto mt-3 flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-white/10 hover:text-white/70 transition-colors"
          title="Expand sidebar"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {/* ── User Info Card ── */}
      {!isCollapsed && mounted && user && (
        <div className="mx-3 mt-3 mb-1 rounded-xl border border-white/[0.08] bg-white/[0.05] p-3">
          <div className="flex items-center gap-2.5">
            <Avatar className="h-9 w-9 shrink-0 ring-1 ring-primary-500/30">
              <AvatarImage src={user.profileImage || ''} />
              <AvatarFallback className="bg-primary-700 text-white text-xs font-bold">
                {getInitials(user.displayName || `${user.firstName} ${user.lastName}`)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user.displayName || `${user.firstName} ${user.lastName}`}
              </p>
              <p className="text-[11px] text-primary-400/70 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed: just avatar */}
      {isCollapsed && mounted && user && (
        <div className="flex justify-center mt-3 mb-1">
          <Avatar className="h-8 w-8 ring-1 ring-primary-500/30">
            <AvatarImage src={user.profileImage || ''} />
            <AvatarFallback className="bg-primary-700 text-white text-[10px] font-bold">
              {getInitials(user.displayName || `${user.firstName} ${user.lastName}`)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* ── Navigation ── */}
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="space-y-4">
          {sidebarLinks.map((section) => (
            <div key={section.section}>
              {!isCollapsed ? (
                <p className="mb-1 px-3 text-[9px] font-bold uppercase tracking-[0.15em] text-white/20">
                  {section.section}
                </p>
              ) : (
                <div className="my-1.5 mx-auto h-px w-5 bg-white/10 rounded-full" />
              )}

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavClick}
                      title={isCollapsed ? item.label : undefined}
                      className={cn(
                        'group flex items-center rounded-xl text-sm font-medium transition-all duration-150',
                        isCollapsed ? 'justify-center h-10 w-10 mx-auto px-0' : 'gap-3 px-3 py-2.5',
                        isActive
                          ? 'bg-primary-600/20 text-primary-300'
                          : 'text-white/50 hover:bg-white/[0.07] hover:text-white/90',
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-[18px] w-[18px] shrink-0 transition-colors',
                          isActive ? 'text-primary-400' : 'text-white/35 group-hover:text-white/70',
                        )}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 leading-none">{item.label}</span>
                          {isActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary-400 shrink-0" />
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

    </aside>
  );
}

export function Sidebar({ isCollapsed = false, onToggle, mobileOpen = false, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* ══ MOBILE DRAWER (< md) ══ */}
      {/* Backdrop */}
      <div
        onClick={onMobileClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      />
      {/* Drawer panel */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <SidebarPanel
          isCollapsed={false}
          onClose={onMobileClose}
          showCloseButton
        />
      </div>

      {/* ══ TABLET (md → lg): always-visible, always-collapsed icon rail ══ */}
      <div className="hidden md:flex lg:hidden fixed inset-y-0 left-0 z-40 w-16">
        <SidebarPanel isCollapsed onToggle={onToggle} />
      </div>

      {/* ══ DESKTOP (≥ lg): always-visible, toggleable ══ */}
      <div
        className={cn(
          'hidden lg:flex fixed inset-y-0 left-0 z-40 transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64',
        )}
      >
        <SidebarPanel isCollapsed={isCollapsed} onToggle={onToggle} />
      </div>
    </>
  );
}
