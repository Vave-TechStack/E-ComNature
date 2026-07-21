'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, LogOut, Settings, UserCircle, Package as PackageIcon, ShieldCheck } from 'lucide-react';
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
import { getInitials } from '@/lib/utils';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

export function UserMenuDesktop() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { isLoading } = useAppSelector((state) => state.auth);

  // Always render Sign In during loading, switch to DropdownMenu after render
  if (!isAuthenticated || !user) {
    return (
      <Link href="/auth/login">
        <motion.span
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary-200/50 transition-all hover:shadow-xl hover:shadow-primary-200/60 cursor-pointer"
        >
          <User className="h-4 w-4" />
          Sign In
        </motion.span>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 rounded-xl bg-white border border-noble-200/60 pl-1.5 pr-3 py-1.5 shadow-sm hover:shadow-md hover:border-primary-200/80 transition-all cursor-pointer"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={user.profileImage || ''} />
            <AvatarFallback className="bg-gradient-to-br from-primary-100 to-emerald-100 text-primary-700 text-[10px] font-bold">
              {getInitials(user.displayName || user.firstName + ' ' + user.lastName)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-noble-800 max-w-[100px] truncate">
            {user.displayName || user.firstName}
          </span>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl border border-noble-200/60 bg-white p-1.5 shadow-xl">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2.5 py-1.5">
            <p className="text-sm font-bold text-noble-800 truncate">{user.displayName || user.firstName + ' ' + user.lastName}</p>
            <p className="text-xs text-noble-500 truncate">{user.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-noble-100/80" />
          {user.role === 'ROLE_ADMIN' && (
            <DropdownMenuItem className="rounded-lg cursor-pointer text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50" onClick={() => router.push('/admin/dashboard')}>
              <ShieldCheck className="h-4 w-4" /> Admin Dashboard
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="rounded-lg cursor-pointer text-noble-600 focus:text-primary-600 focus:bg-primary-50" onClick={() => router.push('/profile')}>
            <UserCircle className="h-4 w-4" /> My Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-lg cursor-pointer text-noble-600 focus:text-primary-600 focus:bg-primary-50" onClick={() => router.push('/profile/orders')}>
            <PackageIcon className="h-4 w-4" /> My Orders
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-lg cursor-pointer text-noble-600 focus:text-primary-600 focus:bg-primary-50" onClick={() => router.push('/profile/settings')}>
            <Settings className="h-4 w-4" /> Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-noble-100/80" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="rounded-lg cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50" onClick={() => { dispatch(logout()); router.push('/'); }}>
            <LogOut className="h-4 w-4" /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserMenuMobile() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return (
      <Link href="/auth/login" className="p-2.5 rounded-xl hover:bg-noble-100 dark:hover:bg-noble-800 transition-colors text-noble-500 hover:text-noble-700 sm:hidden">
        <User className="h-5 w-5" />
      </Link>
    );
  }

  const targetHref = user.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/profile';

  return (
    <Link href={targetHref} className="p-2.5 rounded-xl hover:bg-noble-100 dark:hover:bg-noble-800 transition-colors text-noble-500 hover:text-noble-700 sm:hidden">
      <Avatar className="h-6 w-6">
        <AvatarImage src={user.profileImage || ''} />
        <AvatarFallback className="bg-gradient-to-br from-primary-100 to-emerald-100 text-primary-700 text-[10px] font-bold">
          {getInitials(user.displayName || user.firstName + ' ' + user.lastName)}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
}

export function UserMenuMobileDrawer() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return (
      <Link href="/auth/login">
        <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg cursor-pointer">
          <User className="h-4 w-4" /> Sign In / Register
        </span>
      </Link>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 px-2">
        <Avatar className="h-10 w-10 rounded-xl">
          <AvatarImage src={user.profileImage || ''} />
          <AvatarFallback className="bg-gradient-to-br from-primary-100 to-emerald-100 text-primary-700 text-sm font-bold rounded-xl">
            {getInitials(user.displayName || user.firstName + ' ' + user.lastName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-bold text-noble-800">{user.displayName || user.firstName + ' ' + user.lastName}</p>
          <p className="text-xs text-noble-500">{user.email}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {user.role === 'ROLE_ADMIN' && (
          <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-all">
            <ShieldCheck className="h-4 w-4" /> Admin Dashboard
          </Link>
        )}
        <Link href="/profile" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-noble-600 hover:bg-primary-50 hover:text-primary-600 transition-all">
          <UserCircle className="h-4 w-4" /> My Profile
        </Link>
        <Link href="/profile/orders" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-noble-600 hover:bg-primary-50 hover:text-primary-600 transition-all">
          <PackageIcon className="h-4 w-4" /> My Orders
        </Link>
        <button onClick={() => { dispatch(logout()); router.push('/'); }} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full text-left">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
