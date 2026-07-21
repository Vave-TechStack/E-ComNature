'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Download, Eye, MoreHorizontal, ArrowUpDown,
  Package, ChevronLeft, ChevronRight, ShoppingBag, RefreshCw,
  Clock, CheckCircle2, XCircle, Truck, Ban
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

const orders = [
  { id: '#ORD-45689', customer: 'Rajesh Kumar', email: 'rajesh@email.com', items: 3, amount: 12499, status: 'Delivered', payment: 'Paid', date: '15 Jan 2026' },
  { id: '#ORD-45690', customer: 'Priya Sharma', email: 'priya@email.com', items: 1, amount: 4599, status: 'Processing', payment: 'Pending', date: '15 Jan 2026' },
  { id: '#ORD-45691', customer: 'Amit Patel', email: 'amit@email.com', items: 5, amount: 28999, status: 'Shipped', payment: 'Paid', date: '14 Jan 2026' },
  { id: '#ORD-45692', customer: 'Sneha Gupta', email: 'sneha@email.com', items: 2, amount: 8999, status: 'Pending', payment: 'Unpaid', date: '14 Jan 2026' },
  { id: '#ORD-45693', customer: 'Vikram Singh', email: 'vikram@email.com', items: 4, amount: 19999, status: 'Delivered', payment: 'Paid', date: '13 Jan 2026' },
  { id: '#ORD-45694', customer: 'Neha Verma', email: 'neha@email.com', items: 1, amount: 2999, status: 'Cancelled', payment: 'Refunded', date: '13 Jan 2026' },
  { id: '#ORD-45695', customer: 'Rahul Jain', email: 'rahul@email.com', items: 6, amount: 45999, status: 'Processing', payment: 'Paid', date: '12 Jan 2026' },
  { id: '#ORD-45696', customer: 'Ananya Reddy', email: 'ananya@email.com', items: 2, amount: 15999, status: 'Delivered', payment: 'Paid', date: '12 Jan 2026' },
  { id: '#ORD-45697', customer: 'Deepak Joshi', email: 'deepak@email.com', items: 3, amount: 7499, status: 'Returned', payment: 'Refunded', date: '11 Jan 2026' },
  { id: '#ORD-45698', customer: 'Kavita Singh', email: 'kavita@email.com', items: 1, amount: 12999, status: 'Shipped', payment: 'Paid', date: '11 Jan 2026' },
];

const statusConfig: Record<string, { bg: string; badge: string; icon: React.ElementType }> = {
  Delivered: { bg: 'bg-emerald-500/10', badge: 'bg-emerald-500/15 text-emerald-600 border-emerald-200/50', icon: CheckCircle2 },
  Processing: { bg: 'bg-blue-500/10', badge: 'bg-blue-500/15 text-blue-600 border-blue-200/50', icon: RefreshCw },
  Shipped: { bg: 'bg-purple-500/10', badge: 'bg-purple-500/15 text-purple-600 border-purple-200/50', icon: Truck },
  Pending: { bg: 'bg-amber-500/10', badge: 'bg-amber-500/15 text-amber-600 border-amber-200/50', icon: Clock },
  Cancelled: { bg: 'bg-red-500/10', badge: 'bg-red-500/15 text-red-600 border-red-200/50', icon: XCircle },
  Returned: { bg: 'bg-primary-500/10', badge: 'bg-primary-500/15 text-primary-600 border-primary-200/50', icon: Ban },
};

const paymentConfig: Record<string, { badge: string }> = {
  Paid: { badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50' },
  Pending: { badge: 'bg-amber-500/10 text-amber-600 border-amber-200/50' },
  Unpaid: { badge: 'bg-red-500/10 text-red-600 border-red-200/50' },
  Refunded: { badge: 'bg-noble-100 text-noble-600 border-noble-200/50' },
};

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: 'easeOut' as const },
  }),
};

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

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
          <h1 className="text-2xl font-bold text-noble-800">Orders</h1>
          <p className="text-sm text-noble-500">Manage all customer orders</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-xl border border-noble-200 bg-white/80 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-noble-600 shadow-sm transition-all hover:bg-white hover:shadow-md hover:border-noble-300"
        >
          <Download className="h-4 w-4" /> Export
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
            placeholder="Search orders by ID, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-xl border border-noble-200/60 bg-white/70 backdrop-blur-sm px-3 py-2 text-sm text-noble-700 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
        <select className="h-10 rounded-xl border border-noble-200/60 bg-white/70 backdrop-blur-sm px-3 py-2 text-sm text-noble-700 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all">
          <option>All Payment</option>
          <option>Paid</option>
          <option>Pending</option>
          <option>Refunded</option>
          <option>Unpaid</option>
        </select>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: 'Total Orders', value: '1,245', icon: ShoppingBag, color: 'from-primary-600 to-emerald-500' },
          { label: 'Pending', value: '38', icon: Clock, color: 'from-amber-500 to-orange-500' },
          { label: 'Processing', value: '24', icon: RefreshCw, color: 'from-blue-500 to-cyan-500' },
          { label: 'Delivered Today', value: '52', icon: CheckCircle2, color: 'from-emerald-500 to-teal-500' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.35 }}
              className="relative overflow-hidden rounded-2xl border border-noble-200/60 bg-white/60 backdrop-blur-xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="absolute top-3 right-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-xs font-medium text-noble-500 uppercase tracking-wider">{stat.label}</p>
              <p className="mt-1.5 text-2xl font-bold text-noble-800">{stat.value}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="overflow-hidden rounded-2xl border border-noble-200/60 bg-white/60 backdrop-blur-xl shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-noble-100/80 bg-noble-50/50">
                {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Payment', 'Date', 'Actions'].map((heading, i) => (
                  <th key={heading} className={`text-left py-3.5 px-4 font-semibold text-noble-500 text-xs uppercase tracking-wider ${
                    [1, 2, 5, 6].includes(i) ? 'hidden md:table-cell' : ''
                  }`}>
                    {heading === 'Order ID' || heading === 'Amount' ? (
                      <span className="inline-flex items-center gap-1 cursor-pointer hover:text-noble-700 transition-colors">
                        {heading} <ArrowUpDown className="h-3 w-3" />
                      </span>
                    ) : heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {orders.map((order, index) => {
                  const statusCfg = statusConfig[order.status] || statusConfig.Pending;
                  const payCfg = paymentConfig[order.payment] || paymentConfig.Pending;
                  const StatusIcon = statusCfg.icon;

                  return (
                    <motion.tr
                      key={order.id}
                      variants={rowVariants}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                      whileHover={{ backgroundColor: 'rgba(200, 200, 220, 0.08)' }}
                      className="group border-b border-noble-100/40 transition-colors last:border-0"
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-noble-800">{order.id}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-noble-800">{order.customer}</p>
                        <p className="text-xs text-noble-500">{order.email}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-noble-100/80 text-xs font-semibold text-noble-600">
                          {order.items}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-noble-800">{formatPrice(order.amount)}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${statusCfg.badge}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {order.status}
                        </motion.span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${payCfg.badge}`}>
                          {order.payment}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-noble-500 text-xs">{order.date}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(99,102,241,0.1)' }}
                            whileTap={{ scale: 0.9 }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-noble-400 hover:text-primary-600 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(99,102,241,0.1)' }}
                            whileTap={{ scale: 0.9 }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-noble-400 hover:text-noble-600 transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-noble-100/80 bg-noble-50/30 px-4 py-3.5">
          <p className="text-xs text-noble-500">Showing 1–10 of 1,245 orders</p>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled
              className="inline-flex items-center gap-1.5 rounded-xl border border-noble-200/60 bg-white/70 px-3.5 py-2 text-xs font-medium text-noble-400 shadow-sm opacity-50 cursor-not-allowed"
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
        </div>
      </motion.div>
    </motion.div>
  );
}
