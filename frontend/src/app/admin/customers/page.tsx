'use client';

import { motion } from 'framer-motion';
import {
  Search, Filter, MoreHorizontal, Mail, Ban, Star,
  Users, UserPlus, TrendingUp, DollarSign, Award,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials, formatDate, formatPrice } from '@/lib/utils';

const customers = [
  { name: 'Rajesh Kumar', email: 'rajesh@email.com', phone: '+91 9876543210', orders: 24, spent: 289000, joined: '2025-06-15', status: 'Active' as const, avatar: '' },
  { name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 9876543211', orders: 18, spent: 156000, joined: '2025-07-22', status: 'Active' as const, avatar: '' },
  { name: 'Amit Patel', email: 'amit@email.com', phone: '+91 9876543212', orders: 32, spent: 425000, joined: '2025-05-10', status: 'Active' as const, avatar: '' },
  { name: 'Sneha Gupta', email: 'sneha@email.com', phone: '+91 9876543213', orders: 5, spent: 35000, joined: '2025-11-05', status: 'Inactive' as const, avatar: '' },
  { name: 'Vikram Singh', email: 'vikram@email.com', phone: '+91 9876543214', orders: 45, spent: 678000, joined: '2025-03-18', status: 'Active' as const, avatar: '' },
  { name: 'Neha Verma', email: 'neha@email.com', phone: '+91 9876543215', orders: 2, spent: 8000, joined: '2026-01-02', status: 'Active' as const, avatar: '' },
  { name: 'Rahul Jain', email: 'rahul@email.com', phone: '+91 9876543216', orders: 12, spent: 98000, joined: '2025-09-14', status: 'Active' as const, avatar: '' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' as const },
  }),
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 0.15 + i * 0.08, duration: 0.4, ease: 'easeOut' as const },
  }),
};

const tierColors: Record<string, string> = {
  Platinum: 'from-slate-300 to-slate-100 text-slate-700',
  Gold: 'from-amber-300 to-amber-100 text-amber-700',
  Silver: 'from-gray-300 to-gray-100 text-gray-600',
  Bronze: 'from-orange-300 to-orange-100 text-orange-700',
};

function getTier(spent: number): string {
  if (spent > 500000) return 'Platinum';
  if (spent > 200000) return 'Gold';
  if (spent > 50000) return 'Silver';
  return 'Bronze';
}

export default function CustomersPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-noble-800">Customers</h1>
          <p className="text-sm text-noble-500">View and manage your customers</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary-200/50 transition-all hover:shadow-xl hover:shadow-primary-200/60"
        >
          <UserPlus className="h-4 w-4" /> Add Customer
        </motion.button>
      </div>

      {/* Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="flex flex-wrap items-center gap-3 rounded-2xl border border-noble-200/60 bg-white/60 backdrop-blur-xl p-4 shadow-sm"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-noble-400" />
          <Input
            placeholder="Search customers by name, email..."
            className="h-10 pl-10 border-noble-200/60 bg-white/70 backdrop-blur-sm rounded-xl text-sm placeholder:text-noble-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 rounded-xl border border-noble-200/60 bg-white/70 backdrop-blur-sm px-4 py-2 text-sm font-medium text-noble-600 shadow-sm hover:bg-white hover:border-noble-300 transition-all"
        >
          <Filter className="h-4 w-4" /> Filters
        </motion.button>
        <select className="h-10 rounded-xl border border-noble-200/60 bg-white/70 backdrop-blur-sm px-3 py-2 text-sm text-noble-700 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all">
          <option>All Customers</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>VIP</option>
        </select>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Customers', value: '7,892', icon: Users, change: '+12%', color: 'from-primary-600 to-emerald-500' },
          { label: 'Active Now', value: '143', icon: TrendingUp, change: '+5%', color: 'from-emerald-500 to-teal-500' },
          { label: 'Avg. Spend', value: '₹12.4K', icon: DollarSign, change: '+8%', color: 'from-blue-500 to-cyan-500' },
          { label: 'VIP Customers', value: '892', icon: Award, change: '+15%', color: 'from-amber-500 to-orange-500' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={statVariants}
              custom={i}
              initial="hidden"
              animate="visible"
              className="relative overflow-hidden rounded-2xl border border-noble-200/60 bg-white/60 backdrop-blur-xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-noble-100 to-noble-50">
                  <Icon className="h-4 w-4 text-noble-600" />
                </div>
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"
                >
                  {stat.change}
                </motion.span>
              </div>
              <p className="mt-3 text-xs font-medium text-noble-500 uppercase tracking-wider">{stat.label}</p>
              <p className="mt-0.5 text-xl font-bold text-noble-800">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Customer Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {customers.map((customer, index) => {
          const tier = getTier(customer.spent);
          const tierClass = tierColors[tier];

          return (
            <motion.div
              key={customer.email}
              variants={cardVariants}
              custom={index}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden rounded-2xl border border-noble-200/60 bg-white/60 backdrop-blur-xl p-5 shadow-sm hover:shadow-lg hover:border-noble-300/80 transition-all"
            >
              {/* Gradient accent top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-emerald-400 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Tier Badge */}
              <div className="absolute top-3 right-3">
                <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${tierClass} px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-white/20`}>
                  <Award className="h-3 w-3" />
                  {tier}
                </span>
              </div>

              {/* Customer Info */}
              <div className="flex items-start gap-3.5">
                <Avatar className="h-12 w-12 rounded-xl ring-2 ring-noble-100/80">
                  <AvatarImage src={customer.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary-100 to-emerald-100 text-primary-700 font-semibold text-sm rounded-xl">
                    {getInitials(customer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-noble-800 truncate">{customer.name}</p>
                  <p className="text-xs text-noble-500 truncate">{customer.email}</p>
                  <p className="text-[11px] text-noble-400 mt-0.5">{customer.phone}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-noble-50/50 backdrop-blur-sm border border-noble-100/50 p-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-noble-800">{customer.orders}</p>
                  <p className="text-[10px] font-medium text-noble-500 uppercase tracking-wider">Orders</p>
                </div>
                <div className="text-center border-x border-noble-100/50">
                  <p className="text-lg font-bold text-noble-800">{formatPrice(customer.spent / 1000)}K</p>
                  <p className="text-[10px] font-medium text-noble-500 uppercase tracking-wider">Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-noble-800">{formatDate(customer.joined, 'MMM yy')}</p>
                  <p className="text-[10px] font-medium text-noble-500 uppercase tracking-wider">Joined</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-3 flex items-center justify-between">
                <Badge
                  className={
                    customer.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50 text-xs font-medium'
                      : 'bg-noble-100 text-noble-500 border-noble-200/50 text-xs font-medium'
                  }
                  variant="outline"
                >
                  <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${customer.status === 'Active' ? 'bg-emerald-500' : 'bg-noble-400'}`} />
                  {customer.status}
                </Badge>

                {/* Action Buttons */}
                <div className="flex gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(99,102,241,0.08)' }}
                    whileTap={{ scale: 0.9 }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-noble-400 hover:text-primary-600 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(99,102,241,0.08)' }}
                    whileTap={{ scale: 0.9 }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-noble-400 hover:text-amber-500 transition-colors"
                  >
                    <Star className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(239,68,68,0.08)' }}
                    whileTap={{ scale: 0.9 }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-noble-400 hover:text-red-500 transition-colors"
                  >
                    <Ban className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-between rounded-2xl border border-noble-200/60 bg-white/60 backdrop-blur-xl px-4 py-3.5 shadow-sm"
      >
        <p className="text-xs text-noble-500">Showing 1–7 of 7,892 customers</p>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled
            className="inline-flex items-center gap-1.5 rounded-xl border border-noble-200/60 bg-white/70 px-3.5 py-2 text-xs font-medium text-noble-400 opacity-50 cursor-not-allowed"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Previous
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-noble-200/60 bg-white/70 backdrop-blur-sm px-3.5 py-2 text-xs font-medium text-noble-700 shadow-sm hover:bg-white hover:border-noble-300 transition-all"
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
