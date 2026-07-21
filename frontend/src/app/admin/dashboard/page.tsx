'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package,
  Clock, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Activity, Download, RefreshCw, Eye, CheckCircle, XCircle,
  CreditCard, Truck, ShoppingCart, AlertCircle, Zap, CalendarDays, Tag,
  Leaf, Sparkles, TrendingUpIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { formatPrice, cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// ===== Animated Counter Hook =====
function useCountUp(target: number, duration = 1500, enabled = true) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) { setCount(target); return; }
    startTime.current = null;
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration, enabled]);

  return count;
}

// ===== Data =====
const statCards = [
  { label: 'Total Revenue', value: 12456789, change: 12.5, trend: 'up', icon: DollarSign, gradient: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', format: (v: number) => formatPrice(v) },
  { label: 'Total Orders', value: 12456, change: 8.2, trend: 'up', icon: ShoppingBag, gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', format: (v: number) => v.toLocaleString() },
  { label: 'Total Customers', value: 34256, change: -3.1, trend: 'down', icon: Users, gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', format: (v: number) => v.toLocaleString() },
  { label: 'Active Products', value: 5678, change: 15.7, trend: 'up', icon: Package, gradient: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', format: (v: number) => v.toLocaleString() },
];

const dailyComparison = {
  today: { revenue: 285000, orders: 142, visitors: 3456, conversion: 4.2 },
  yesterday: { revenue: 252000, orders: 128, visitors: 3120, conversion: 3.9 },
};

const lowStockItems = [
  { name: 'A2 Gir Cow Ghee (500ml)', sku: 'GHE-A2-500', stock: 8, threshold: 20, category: 'Ghee' },
  { name: 'Lakadong Turmeric (250g)', sku: 'SPC-TUR-250', stock: 5, threshold: 15, category: 'Spices' },
  { name: 'Cold Pressed Coconut Oil (1L)', sku: 'OIL-CCO-1L', stock: 12, threshold: 25, category: 'Oils' },
  { name: 'Forest Raw Honey (500g)', sku: 'HNY-FRH-500', stock: 3, threshold: 30, category: 'Honey' },
];

const recentActivities = [
  { action: 'New order placed', detail: '#ORD-45699 by Priya Sharma', time: '2 min ago', type: 'order' },
  { action: 'Payment received', detail: '#ORD-45698 - ₹12,999 via UPI', time: '15 min ago', type: 'payment' },
  { action: 'Product stock low', detail: 'A2 Ghee (500ml) — only 8 left', time: '32 min ago', type: 'alert' },
  { action: 'Order shipped', detail: '#ORD-45695 via Delhivery', time: '1 hour ago', type: 'shipping' },
  { action: 'New customer registered', detail: 'Ananya Reddy — ananya@email.com', time: '2 hours ago', type: 'user' },
  { action: 'Return request initiated', detail: '#ORD-45692 — Mango Pickle (500g)', time: '3 hours ago', type: 'return' },
  { action: 'Coupon used', detail: 'WELCOME20 by 5 customers', time: '4 hours ago', type: 'coupon' },
];

const activityIcons: Record<string, typeof Activity> = {
  order: ShoppingCart, payment: CreditCard, alert: AlertTriangle,
  shipping: Truck, user: Users, return: XCircle, coupon: Tag,
};

const iconColorMap: Record<string, string> = { blue: 'text-blue-600', emerald: 'text-emerald-600', purple: 'text-purple-600', orange: 'text-orange-600' };

const revenueData = [
  { month: 'Jan', revenue: 450000, orders: 1200, profit: 180000 },
  { month: 'Feb', revenue: 520000, orders: 1350, profit: 210000 },
  { month: 'Mar', revenue: 480000, orders: 1100, profit: 190000 },
  { month: 'Apr', revenue: 610000, orders: 1500, profit: 250000 },
  { month: 'May', revenue: 750000, orders: 1800, profit: 310000 },
  { month: 'Jun', revenue: 820000, orders: 2100, profit: 340000 },
  { month: 'Jul', revenue: 780000, orders: 1900, profit: 320000 },
  { month: 'Aug', revenue: 850000, orders: 2200, profit: 350000 },
  { month: 'Sep', revenue: 920000, orders: 2400, profit: 380000 },
  { month: 'Oct', revenue: 890000, orders: 2300, profit: 360000 },
  { month: 'Nov', revenue: 1050000, orders: 2800, profit: 430000 },
  { month: 'Dec', revenue: 1250000, orders: 3200, profit: 520000 },
];

const orderStatusData = [
  { name: 'Delivered', value: 8560, color: '#22c55e' },
  { name: 'Processing', value: 2450, color: '#3b82f6' },
  { name: 'Shipped', value: 1890, color: '#8b5cf6' },
  { name: 'Pending', value: 980, color: '#f59e0b' },
  { name: 'Cancelled', value: 456, color: '#ef4444' },
  { name: 'Returned', value: 320, color: '#64748b' },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'Rajesh Kumar', items: 3, amount: 12499, status: 'Delivered', date: '2 hours ago' },
  { id: '#ORD-002', customer: 'Priya Sharma', items: 1, amount: 4599, status: 'Processing', date: '4 hours ago' },
  { id: '#ORD-003', customer: 'Amit Patel', items: 5, amount: 28999, status: 'Shipped', date: '6 hours ago' },
  { id: '#ORD-004', customer: 'Sneha Gupta', items: 2, amount: 8999, status: 'Pending', date: '8 hours ago' },
  { id: '#ORD-005', customer: 'Vikram Singh', items: 4, amount: 19999, status: 'Delivered', date: '12 hours ago' },
  { id: '#ORD-006', customer: 'Neha Verma', items: 1, amount: 2999, status: 'Cancelled', date: '1 day ago' },
  { id: '#ORD-007', customer: 'Rahul Jain', items: 6, amount: 45999, status: 'Processing', date: '1 day ago' },
];

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-noble-200 bg-white/95 backdrop-blur-md p-3 shadow-xl shadow-noble-200/50">
        <p className="text-sm font-bold text-noble-800 mb-1.5">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.name === 'revenue' || entry.name === 'profit' ? formatPrice(entry.value) : entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ===== Animated Stat Card Component =====
function AnimatedStatCard({ stat: s, index }: { stat: typeof statCards[0]; index: number }) {
  const Icon = s.icon;
  const animatedValue = useCountUp(s.value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="relative overflow-hidden rounded-2xl border border-noble-200 bg-gradient-to-br from-white to-noble-50/50 p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
    >
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary-100/20 rounded-full blur-2xl pointer-events-none group-hover:bg-primary-100/30 transition-all" />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.bg} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`h-5 w-5 ${iconColorMap[s.gradient.split('-')[1]] || 'text-gray-600'}`} />
          </div>
          <Badge className={cn(
            'gap-1 text-xs font-semibold rounded-full border-0',
            s.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          )}>
            {s.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(s.change)}%
          </Badge>
        </div>
        <p className="mt-4 text-2xl font-bold text-noble-900 tabular-nums">
          {s.format(animatedValue)}
        </p>
        <p className="mt-1 text-sm text-noble-400">{s.label}</p>
        <div className="mt-3 h-1.5 rounded-full bg-noble-100 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (s.value / (s.value * 1.3)) * 100)}%` }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${s.gradient}`}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ===== Main Dashboard Page =====
export default function AdminDashboard() {
  const [revenuePeriod, setRevenuePeriod] = useState<'yearly' | 'monthly'>('yearly');
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-primary-100">
              <Sparkles className="h-4 w-4 text-primary-600" />
            </div>
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">Analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-noble-900">Dashboard</h1>
          <p className="text-sm text-noble-400">Your e-commerce performance at a glance</p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-2 px-2">
          <div className="flex items-center gap-1 rounded-xl border border-noble-200 bg-white p-1 shadow-sm shrink-0">
            {['7days', '30days', '90days', 'year'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={cn(
                  'px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap',
                  selectedPeriod === p ? 'bg-noble-900 text-white shadow-sm' : 'text-noble-500 hover:text-noble-800'
                )}
              >
                {p === '7days' ? '7 Days' : p === '30days' ? '30 Days' : p === '90days' ? '90 Days' : 'Year'}
              </button>
            ))}
          </div>
          <Button size="sm" variant="outline" className="gap-2 shrink-0 rounded-xl border-noble-200 text-noble-600 hover:bg-noble-50 hover:border-noble-300">
            <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </motion.div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <AnimatedStatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* ===== DAILY COMPARISON ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {Object.entries(dailyComparison.today).map(([key, value]) => {
          const yesterday = dailyComparison.yesterday[key as keyof typeof dailyComparison.yesterday];
          const diff = ((value - yesterday) / yesterday) * 100;
          const isPositive = diff >= 0;
          return (
            <div key={key} className="rounded-xl border border-noble-200 bg-gradient-to-br from-white to-noble-50/50 p-3.5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-noble-500 capitalize font-medium">{key}</p>
                <Badge className={cn(
                  'gap-0.5 text-[10px] rounded-full border-0',
                  isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                )}>
                  {isPositive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                  {Math.abs(diff).toFixed(1)}%
                </Badge>
              </div>
              <p className="text-lg font-bold text-noble-900">
                {key === 'revenue' ? formatPrice(value) : key === 'conversion' ? `${value}%` : value.toLocaleString()}
              </p>
              <p className="text-[10px] text-noble-400 mt-0.5">
                Yesterday: {key === 'revenue' ? formatPrice(yesterday) : key === 'conversion' ? `${yesterday}%` : yesterday}
              </p>
            </div>
          );
        })}
      </motion.div>

      {/* ===== CHARTS ROW ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl border border-noble-200 bg-gradient-to-br from-white to-noble-50/50 p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-noble-800">Revenue Overview</h3>
              <p className="text-sm text-noble-400">Monthly revenue and profit trends</p>
            </div>
            <div className="flex gap-1.5 p-0.5 rounded-lg bg-noble-50 border border-noble-200">
              <button
                onClick={() => setRevenuePeriod('yearly')}
                className={cn(
                  'px-3 py-1 text-xs font-semibold rounded-md transition-all',
                  revenuePeriod === 'yearly' ? 'bg-white text-noble-800 shadow-sm' : 'text-noble-500 hover:text-noble-700'
                )}
              >
                Yearly
              </button>
              <button
                onClick={() => setRevenuePeriod('monthly')}
                className={cn(
                  'px-3 py-1 text-xs font-semibold rounded-md transition-all',
                  revenuePeriod === 'monthly' ? 'bg-white text-noble-800 shadow-sm' : 'text-noble-500 hover:text-noble-700'
                )}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E4DA" strokeOpacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#888A7C' }} axisLine={{ stroke: '#E3E4DA' }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#888A7C' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fill="url(#revenueGradient)" name="revenue" />
                <Area type="monotone" dataKey="profit" stroke="#059669" strokeWidth={2} fill="url(#profitGradient)" name="profit" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Orders by Status Pie */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-noble-200 bg-gradient-to-br from-white to-noble-50/50 p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-base font-bold text-noble-800 mb-1">Orders by Status</h3>
          <p className="text-sm text-noble-400 mb-4">Distribution of order statuses</p>
          <div className="flex flex-col items-center">
            <div className="h-56 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                    {orderStatusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 w-full max-w-sm">
              {orderStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-noble-500">{item.name}</span>
                  <span className="font-semibold text-noble-800 ml-auto tabular-nums">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ===== LOW STOCK ALERTS ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-red-200/60 bg-gradient-to-br from-white to-red-50/30 p-6 shadow-sm"
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-100/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 border border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
              <h3 className="text-base font-bold text-noble-800">Low Stock Alerts</h3>
            </div>
            <Badge className="bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-semibold">
              {lowStockItems.length} items
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {lowStockItems.map((item, i) => {
              const stockPercent = Math.round((item.stock / item.threshold) * 100);
              const isCritical = item.stock <= 5;
              return (
                <motion.div
                  key={item.sku}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/admin/products?sku=${item.sku}`}
                    className="block rounded-xl border border-red-100 bg-white p-3.5 hover:bg-red-50/50 transition-all duration-200 hover:shadow-md group"
                  >
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-noble-800 truncate group-hover:text-red-600 transition-colors">{item.name}</p>
                        <p className="text-xs text-noble-400">{item.category} · {item.sku}</p>
                      </div>
                      <Badge className={cn(
                        'rounded-full text-xs font-bold border-0',
                        isCritical ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      )}>
                        {item.stock} left
                      </Badge>
                    </div>
                    <div className="h-1.5 rounded-full bg-white overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stockPercent}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={cn('h-full rounded-full', isCritical ? 'bg-red-500' : 'bg-amber-500')}
                      />
                    </div>
                    <p className="mt-1.5 text-[10px] text-noble-400">Threshold: {item.threshold} units</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ===== BOTTOM ROW ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl border border-noble-200 bg-gradient-to-br from-white to-noble-50/50 p-6 shadow-sm lg:col-span-2 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-noble-800">Recent Orders</h3>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl text-xs font-semibold">
                View All →
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-noble-100">
                  <th className="text-left py-3 px-3 font-semibold text-noble-400 text-xs uppercase tracking-wider">Order</th>
                  <th className="text-left py-3 px-3 font-semibold text-noble-400 text-xs uppercase tracking-wider">Customer</th>
                  <th className="text-left py-3 px-3 font-semibold text-noble-400 text-xs uppercase tracking-wider">Items</th>
                  <th className="text-left py-3 px-3 font-semibold text-noble-400 text-xs uppercase tracking-wider">Amount</th>
                  <th className="text-left py-3 px-3 font-semibold text-noble-400 text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-noble-50 hover:bg-white/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3 font-semibold text-noble-800">{order.id}</td>
                    <td className="py-3 px-3 text-noble-500">{order.customer}</td>
                    <td className="py-3 px-3 text-noble-500 tabular-nums">{order.items}</td>
                    <td className="py-3 px-3 font-semibold text-noble-800">{formatPrice(order.amount)}</td>
                    <td className="py-3 px-3">
                      <Badge className={cn(
                        'rounded-full text-[10px] font-semibold border-0',
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                        order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      )}>
                        {order.status}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-noble-200 bg-gradient-to-br from-white to-noble-50/50 p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-primary-100">
                <Activity className="h-4 w-4 text-primary-600" />
              </div>
              <h3 className="text-base font-bold text-noble-800">Activity</h3>
            </div>
            <Badge className="bg-primary-50 text-primary-700 border border-primary-200 rounded-full text-xs font-semibold">
              {recentActivities.length} new
            </Badge>
          </div>
          <div className="space-y-0">
            {recentActivities.map((act, i) => {
              const Icon = (activityIcons[act.type] || Activity) as React.ComponentType<{ className?: string }>;
              const iconColors: Record<string, string> = {
                order: 'text-blue-500 bg-blue-50 border-blue-200',
                payment: 'text-green-500 bg-green-50 border-green-200',
                alert: 'text-red-500 bg-red-50 border-red-200',
                shipping: 'text-purple-500 bg-purple-50 border-purple-200',
                user: 'text-primary-500 bg-primary-50 border-primary-200',
                return: 'text-orange-500 bg-orange-50 border-orange-200',
                coupon: 'text-amber-500 bg-amber-50 border-amber-200',
              };
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex gap-3 py-3 border-b border-noble-50 last:border-0 group hover:bg-noble-50/30 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${iconColors[act.type] || 'bg-noble-50 text-noble-500 border-noble-200'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-noble-700 group-hover:text-primary-600 transition-colors">{act.action}</p>
                    <p className="text-xs text-noble-400 truncate">{act.detail}</p>
                  </div>
                  <span className="text-[10px] text-noble-400 whitespace-nowrap shrink-0 mt-0.5">{act.time}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
