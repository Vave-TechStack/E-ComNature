'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';
import { Menu, Leaf, Bell, Search, LogOut, UserCircle, Settings, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
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

function getInitials(name: string) {
  return name.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => { setMounted(true); }, []);

  // Hide website header/footer in admin
  useEffect(() => {
    document.body.classList.add('admin-page');
    return () => document.body.classList.remove('admin-page');
  }, []);

  const displayName = user
    ? (user.displayName || `${user.firstName} ${user.lastName}`.trim())
    : 'Admin';

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8]">

      {/* ─── Sidebar ─── */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* ─── Main area: offset by sidebar width ─── */}
      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-300',
          'ml-0',
          'md:ml-16',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64',
        )}
      >

        {/* ─── Top App Bar ─── */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl px-4">

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Brand — mobile only */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm shrink-0">
              <Leaf className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-800">Admin</span>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search products, orders, customers…"
              className="w-full h-9 rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-1 focus:ring-emerald-200 transition-all"
            />
          </div>

          {/* Right: bell + admin profile dropdown */}
          <div className="ml-auto flex items-center gap-2">

            {/* Notification Bell — opens /admin/notifications */}
            <button
              onClick={() => router.push('/admin/notifications')}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-emerald-600 transition-colors"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
            </button>

            {/* Admin User Dropdown Menu */}
            {mounted && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200/80 bg-gray-50 pl-1 pr-2.5 py-1 hover:bg-gray-100/80 hover:border-gray-300 transition-all cursor-pointer">
                    <Avatar className="h-7 w-7 shrink-0 ring-1 ring-emerald-500/20">
                      <AvatarImage src={user.profileImage || ''} />
                      <AvatarFallback className="bg-emerald-600 text-white text-[10px] font-bold">
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-xs font-semibold text-gray-700 max-w-[100px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 rounded-2xl border border-gray-200 bg-white p-1.5 shadow-xl">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-3 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-900 truncate">{displayName}</span>
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                          <ShieldCheck className="h-2.5 w-2.5" /> Admin
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-gray-100" />

                    <DropdownMenuItem
                      className="rounded-xl cursor-pointer text-xs font-medium text-gray-700 focus:text-emerald-700 focus:bg-emerald-50 py-2"
                      onClick={() => router.push('/profile')}
                    >
                      <UserCircle className="h-4 w-4 mr-2 text-emerald-600" /> My Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="rounded-xl cursor-pointer text-xs font-medium text-gray-700 focus:text-emerald-700 focus:bg-emerald-50 py-2"
                      onClick={() => router.push('/admin/settings')}
                    >
                      <Settings className="h-4 w-4 mr-2 text-gray-500" /> Admin Settings
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-gray-100" />

                    <DropdownMenuItem
                      className="rounded-xl cursor-pointer text-xs font-medium text-red-600 focus:text-red-700 focus:bg-red-50 py-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2 text-red-500" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              mounted && (
                <button
                  onClick={() => router.push('/auth/login')}
                  className="text-xs font-semibold text-emerald-600 hover:underline px-2"
                >
                  Sign In
                </button>
              )
            )}
          </div>
        </header>

        {/* ─── Page Content ─── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
