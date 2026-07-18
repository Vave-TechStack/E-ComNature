'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Mail, Phone, MapPin, Package, Heart, Award, Shield,
  Ban, CheckCircle, AlertTriangle, LogIn, Copy, ExternalLink,
  Calendar, Clock, ShoppingBag, TrendingUp, Gift, Lock,
  MoreHorizontal, ChevronRight, Pencil, Trash2, Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { cn, getInitials, formatPrice } from '@/lib/utils';

// ==================== MOCK DATA ====================

const userData = {
  id: 1,
  firstName: 'Rajesh',
  lastName: 'Kumar',
  email: 'rajesh@email.com',
  phone: '+91 9876543210',
  gender: 'Male',
  dateOfBirth: '15 Jun 1990',
  avatar: '',
  role: 'Customer',
  status: 'Active',
  isEmailVerified: true,
  isPhoneVerified: true,
  isAccountLocked: false,
  twoFactorEnabled: false,
  joinedAt: '15 Jun 2025',
  lastLoginAt: '16 Jan 2026, 10:45 AM',
  lastLoginIP: '192.168.1.101',
  lastLoginDevice: 'Chrome 120 - Windows 11',
  totalOrders: 24,
  totalSpent: 289000,
  averageOrderValue: 12042,
  referralCode: 'RAJESH50',
  referredBy: null,
};

const addresses = [
  { id: 1, label: 'Home', fullName: 'Rajesh Kumar', phone: '+91 9876543210', addressLine1: '42, MG Road, Indiranagar', city: 'Bangalore', state: 'Karnataka', pincode: '560038', isDefault: true, addressType: 'home' },
  { id: 2, label: 'Office', fullName: 'Rajesh Kumar', phone: '+91 9876543211', addressLine1: '91, Richmond Road, Ashok Nagar', city: 'Bangalore', state: 'Karnataka', pincode: '560025', isDefault: false, addressType: 'work' },
];

const wishlistItems = [
  { id: 1, name: 'Premium Wireless Noise Cancellation Headphones', brand: 'Sony', price: 24999, image: '' },
  { id: 2, name: 'Ultra-Slim Smartwatch with AMOLED Display', brand: 'Apple', price: 45999, image: '' },
  { id: 3, name: 'Mechanical Gaming Keyboard RGB', brand: 'Razer', price: 12999, image: '' },
  { id: 4, name: 'Portable Bluetooth Speaker Waterproof', brand: 'JBL', price: 7999, image: '' },
];

const rewardData = {
  currentPoints: 8750,
  lifetimePoints: 12450,
  tier: 'Gold',
  walletBalance: 1250,
  recentTransactions: [
    { id: 1, action: 'Order #ORD-45689', points: 1250, type: 'earned', date: '15 Jan 2026' },
    { id: 2, action: 'Product Review', points: 100, type: 'earned', date: '14 Jan 2026' },
    { id: 3, action: 'Coupon Redemption', points: -500, type: 'redeemed', date: '08 Jan 2026' },
    { id: 4, action: 'Referral Bonus', points: 500, type: 'earned', date: '05 Jan 2026' },
    { id: 5, action: 'Birthday Bonus', points: 500, type: 'earned', date: '01 Jan 2026' },
  ],
};

const recentOrders = [
  { id: 'ORD-45689', date: '15 Jan 2026', items: 3, total: 12499, status: 'Delivered', payment: 'Paid' },
  { id: 'ORD-45690', date: '14 Jan 2026', items: 1, total: 4599, status: 'Processing', payment: 'Pending' },
  { id: 'ORD-45691', date: '12 Jan 2026', items: 5, total: 28999, status: 'Shipped', payment: 'Paid' },
];

const tierColors: Record<string, string> = {
  Silver: 'from-gray-300 to-gray-400',
  Gold: 'from-yellow-400 to-yellow-600',
  Platinum: 'from-cyan-400 to-blue-600',
  Elite: 'from-purple-400 to-purple-700',
};

const tierIcons: Record<string, string> = {
  Silver: '🥈', Gold: '🥇', Platinum: '💎', Elite: '👑',
};

// ==================== COMPONENT ====================

export default function AdminCustomerDetailPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLocked, setIsLocked] = useState(userData.isAccountLocked);
  const [showConfirmAction, setShowConfirmAction] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(userData.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tiers = [
    { name: 'Silver', min: 0 },
    { name: 'Gold', min: 5000 },
    { name: 'Platinum', min: 15000 },
    { name: 'Elite', min: 50000 },
  ];
  const currentTierIndex = tiers.reduce((acc, t, i) => rewardData.currentPoints >= t.min ? i : acc, 0);
  const nextTier = tiers[currentTierIndex + 1];
  const tierProgress = nextTier
    ? ((rewardData.currentPoints - tiers[currentTierIndex].min) / (nextTier.min - tiers[currentTierIndex].min)) * 100
    : 100;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: Shield },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'rewards', label: 'Rewards', icon: Award },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/customers">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Detail</h1>
            <p className="text-sm text-gray-500">Manage customer account and data</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn('gap-2', isLocked ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200')}
            onClick={() => setShowConfirmAction(isLocked ? 'unlock' : 'lock')}
          >
            {isLocked ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
            {isLocked ? 'Unlock Account' : 'Lock Account'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-amber-600 border-amber-200"
            onClick={() => setShowConfirmAction('impersonate')}
          >
            <LogIn className="h-4 w-4" />
            Impersonate
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setShowConfirmAction(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-full mb-4',
                  showConfirmAction === 'lock' ? 'bg-red-50' :
                  showConfirmAction === 'unlock' ? 'bg-green-50' : 'bg-amber-50'
                )}>
                  {showConfirmAction === 'lock' ? <Ban className="h-6 w-6 text-red-600" /> :
                   showConfirmAction === 'unlock' ? <CheckCircle className="h-6 w-6 text-green-600" /> :
                   <LogIn className="h-6 w-6 text-amber-600" />}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {showConfirmAction === 'lock' ? 'Lock Account' :
                   showConfirmAction === 'unlock' ? 'Unlock Account' : 'Impersonate User'}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {showConfirmAction === 'lock' && `This will prevent ${userData.firstName} ${userData.lastName} from logging in until the account is unlocked.`}
                  {showConfirmAction === 'unlock' && `This will restore ${userData.firstName} ${userData.lastName}'s access to their account.`}
                  {showConfirmAction === 'impersonate' && `You will be logged in as ${userData.email} with full access to their account. An audit log entry will be created.`}
                </p>
                <div className="mt-6 flex gap-3">
                  <Button variant="outline" onClick={() => setShowConfirmAction(null)}>Cancel</Button>
                  <Button
                    className={cn(
                      showConfirmAction === 'lock' ? 'bg-red-600 hover:bg-red-700' :
                      showConfirmAction === 'unlock' ? 'bg-green-600 hover:bg-green-700' :
                      'bg-amber-600 hover:bg-amber-700'
                    )}
                    onClick={() => {
                      if (showConfirmAction === 'lock' || showConfirmAction === 'unlock') setIsLocked(!isLocked);
                      setShowConfirmAction(null);
                    }}
                  >
                    {showConfirmAction === 'lock' ? 'Lock Account' :
                     showConfirmAction === 'unlock' ? 'Unlock Account' : 'Start Impersonation'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-primary-50 via-primary-100/50 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-gray-100">
                <AvatarImage src={userData.avatar} />
                <AvatarFallback className="bg-primary-100 text-primary-700 text-xl font-semibold">
                  {getInitials(userData.firstName + ' ' + userData.lastName)}
                </AvatarFallback>
              </Avatar>
              {isLocked && (
                <div className="absolute -right-1 -bottom-1 rounded-full bg-red-500 p-1.5 shadow-lg">
                  <Lock className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900">
                  {userData.firstName} {userData.lastName}
                </h2>
                <Badge className={cn(
                  userData.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' :
                  isLocked ? 'bg-red-100 text-red-700 border-red-200' : 'bg-gray-100 text-gray-700'
                )}>
                  {isLocked ? 'Locked' : userData.status}
                </Badge>
                <Badge variant="outline" className="border-primary-200 text-primary-700 bg-primary-50">
                  ID: #{String(userData.id).padStart(5, '0')}
                </Badge>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {userData.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> {userData.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Joined {userData.joinedAt}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-6 sm:border-l sm:border-gray-200 sm:pl-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{userData.totalOrders}</p>
                <p className="text-xs text-gray-500">Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{formatPrice(userData.totalSpent)}</p>
                <p className="text-xs text-gray-500">Total Spent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">{rewardData.currentPoints.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Points</p>
              </div>
            </div>
          </div>

          {/* Verification Badges & Referral */}
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-500">Verification:</span>
              <Badge className={cn('text-xs', userData.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}>
                {userData.isEmailVerified ? 'Email ✓' : 'Email Pending'}
              </Badge>
              <Badge className={cn('text-xs', userData.isPhoneVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}>
                {userData.isPhoneVerified ? 'Phone ✓' : 'Phone Pending'}
              </Badge>
              <Badge className={cn('text-xs', userData.twoFactorEnabled ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700')}>
                2FA {userData.twoFactorEnabled ? 'On' : 'Off'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Referral:</span>
              <code className="rounded bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-700">{userData.referralCode}</code>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyReferral}>
                {copied ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          {/* Last Login Info */}
          <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-3">
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> Last login: {userData.lastLoginAt}
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-3 w-3" /> IP: {userData.lastLoginIP}
              </span>
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3" /> Device: {userData.lastLoginDevice}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all whitespace-nowrap',
                isActive ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* ========== PROFILE TAB ========== */}
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Personal Details */}
            <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Personal Information</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'First Name', value: userData.firstName },
                  { label: 'Last Name', value: userData.lastName },
                  { label: 'Email', value: userData.email },
                  { label: 'Phone', value: userData.phone },
                  { label: 'Gender', value: userData.gender },
                  { label: 'Date of Birth', value: userData.dateOfBirth },
                  { label: 'Role', value: userData.role },
                  { label: 'Member Since', value: userData.joinedAt },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-gray-50 p-3">
                    <dt className="text-xs font-medium text-gray-500">{item.label}</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">{item.value || '—'}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Recent Orders Sidebar */}
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Recent Orders</h3>
                  <Link href={`/admin/orders?customer=${userData.email}`}>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      View All <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.id}</p>
                        <p className="text-xs text-gray-500">{order.date} • {order.items} item{order.items > 1 ? 's' : ''}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{formatPrice(order.total)}</p>
                        <Badge className={cn('text-[10px]',
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                          'bg-blue-100 text-blue-700'
                        )}>{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Actions */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Account Actions</h3>
                <div className="space-y-2">
                  <Link href={`/admin/orders?customer=${userData.email}`}>
                    <Button variant="outline" className="w-full justify-start gap-2 h-10">
                      <ShoppingBag className="h-4 w-4" /> View All Orders
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start gap-2 h-10 text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" /> Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========== ADDRESSES TAB ========== */}
        {activeTab === 'addresses' && (
          <motion.div
            key="addresses"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">Saved Addresses ({addresses.length})</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="relative rounded-xl border-2 border-gray-200 p-4 hover:border-primary-200 transition-colors"
                  >
                    {addr.isDefault && (
                      <Badge className="absolute right-3 top-3 bg-primary-100 text-primary-700 border-0">Default</Badge>
                    )}
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-primary-600 mt-0.5 shrink-0" />
                      <span className="text-xs font-semibold uppercase text-primary-600">{addr.label}</span>
                      <Badge className="ml-auto bg-gray-100 text-gray-700 border-0 text-[10px]">
                        {addr.addressType}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{addr.fullName}</p>
                    <p className="text-sm text-gray-600">{addr.addressLine1}</p>
                    <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-sm text-gray-500 mt-1">Phone: {addr.phone}</p>
                    <div className="mt-3 flex justify-end gap-1 border-t border-gray-100 pt-2">
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-gray-500">
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-red-500">
                        <Trash2 className="h-3 w-3" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity Log Note */}
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 p-3">
                <Shield className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700">
                  All address changes made by {userData.firstName} {userData.lastName} are tracked in the audit log.
                  Address modifications from the admin panel will be logged with your admin account.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========== ORDERS TAB ========== */}
        {activeTab === 'orders' && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">Order History ({userData.totalOrders} total)</h3>
                  <Badge className="bg-primary-100 text-primary-700 border-0">
                    Avg. Order: {formatPrice(userData.averageOrderValue)}
                  </Badge>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-y border-gray-100 bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Order ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Items</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Total</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Payment</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...recentOrders, ...recentOrders].slice(0, 8).map((order, index) => (
                      <tr key={`${order.id}-${index}`} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">{order.id}</td>
                        <td className="py-3 px-4 text-gray-600">{order.date}</td>
                        <td className="py-3 px-4 text-gray-600">{order.items}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">{formatPrice(order.total)}</td>
                        <td className="py-3 px-4">
                          <Badge className={cn(
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                            'bg-yellow-100 text-yellow-700'
                          )}>{order.status}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={cn(
                            order.payment === 'Paid' ? 'text-green-700 border-green-200' :
                            'text-yellow-700 border-yellow-200'
                          )}>{order.payment}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                              View <ExternalLink className="h-3 w-3" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 p-4">
                <p className="text-sm text-gray-500">Showing 6 of {userData.totalOrders} orders</p>
                <Link href={`/admin/orders?customer=${userData.email}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    View All Orders <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========== WISHLIST TAB ========== */}
        {activeTab === 'wishlist' && (
          <motion.div
            key="wishlist"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">Wishlist ({wishlistItems.length} items)</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {wishlistItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-primary-200 hover:shadow-sm transition-all"
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <Package className="h-10 w-10 text-gray-300" />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-gray-500 mb-1">{item.brand}</p>
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                      <p className="mt-1 text-sm font-bold text-gray-900">{formatPrice(item.price)}</p>
                      <div className="mt-2 flex gap-1">
                        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                          <ShoppingBag className="h-3 w-3 mr-1" /> Add to Cart
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-red-400">
                          <Heart className="h-4 w-4 fill-red-400" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {wishlistItems.length === 0 && (
                <div className="flex flex-col items-center py-12 text-center">
                  <Heart className="h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">No items in wishlist</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ========== REWARDS TAB ========== */}
        {activeTab === 'rewards' && (
          <motion.div
            key="rewards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Points Hero */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 p-6 text-white shadow-md">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-300" />
                    <span className="text-sm font-medium text-white/80">Reward Points</span>
                    <span className="text-xl">{tierIcons[rewardData.tier]}</span>
                    <Badge className={cn('bg-gradient-to-r', tierColors[rewardData.tier], 'text-white border-0')}>
                      {rewardData.tier}
                    </Badge>
                  </div>
                  <p className="mt-2 text-4xl font-bold tracking-tight">{rewardData.currentPoints.toLocaleString()}</p>
                  <p className="mt-1 text-sm text-white/70">
                    Lifetime earnings: {rewardData.lifetimePoints.toLocaleString()} points
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/80">Wallet Balance</p>
                  <p className="text-2xl font-bold">{formatPrice(rewardData.walletBalance)}</p>
                </div>
              </div>
              {nextTier && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs text-white/80 mb-1.5">
                    <span>{rewardData.tier}</span>
                    <span className="font-medium">{nextTier.name}</span>
                  </div>
                  <Progress value={tierProgress} className="h-2 bg-white/20 [&>div]:bg-yellow-400" />
                  <p className="mt-1 text-xs text-white/60">
                    {nextTier.min - rewardData.currentPoints} more points to reach {nextTier.name}
                  </p>
                </div>
              )}
            </div>

            {/* Transactions */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">Recent Reward Activity</h3>
              </div>
              <div className="space-y-1">
                {rewardData.recentTransactions.map((txn, index) => (
                  <motion.div
                    key={txn.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full',
                        txn.type === 'earned' ? 'bg-green-50' : 'bg-red-50'
                      )}>
                        {txn.type === 'earned'
                          ? <TrendingUp className="h-4 w-4 text-green-600" />
                          : <Gift className="h-4 w-4 text-red-500" />
                        }
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{txn.action}</p>
                        <p className="text-xs text-gray-400">{txn.date}</p>
                      </div>
                    </div>
                    <span className={cn(
                      'text-sm font-semibold',
                      txn.type === 'earned' ? 'text-green-600' : 'text-red-500'
                    )}>
                      {txn.type === 'earned' ? '+' : ''}{txn.points.toLocaleString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Admin Controls */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Admin Points Control</h3>
              <p className="text-xs text-gray-500 mb-4">Manually adjust reward points for this customer. All changes are logged.</p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex gap-2">
                  <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4" /> Add Points
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2 text-red-600 border-red-200">
                    <Ban className="h-4 w-4" /> Deduct Points
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 ml-auto">
                  <Shield className="h-3.5 w-3.5" />
                  All point adjustments are audited
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
