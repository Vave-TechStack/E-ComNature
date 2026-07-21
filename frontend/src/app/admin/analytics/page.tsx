'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, ShoppingCart, Users, DollarSign,
  Package, Eye, Star, ArrowUpRight, ArrowDownRight,
  BarChart2, PieChart, Activity, Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Mock data ──────────────────────────────────────────────────────────────
const kpiCards = [
  {
    label: 'Total Revenue',
    value: '₹18,42,390',
    change: '+14.5%',
    up: true,
    sub: 'vs last month',
    icon: DollarSign,
    color: 'from-emerald-500 to-green-600',
    bg: 'from-emerald-50 to-green-50',
    border: 'border-emerald-200',
  },
  {
    label: 'Total Orders',
    value: '3,824',
    change: '+8.2%',
    up: true,
    sub: 'vs last month',
    icon: ShoppingCart,
    color: 'from-blue-500 to-indigo-600',
    bg: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200',
  },
  {
    label: 'Active Customers',
    value: '12,543',
    change: '+22.1%',
    up: true,
    sub: 'vs last month',
    icon: Users,
    color: 'from-violet-500 to-purple-600',
    bg: 'from-violet-50 to-purple-50',
    border: 'border-violet-200',
  },
  {
    label: 'Avg. Order Value',
    value: '₹481',
    change: '-3.4%',
    up: false,
    sub: 'vs last month',
    icon: TrendingUp,
    color: 'from-amber-500 to-orange-600',
    bg: 'from-amber-50 to-orange-50',
    border: 'border-amber-200',
  },
  {
    label: 'Product Views',
    value: '2,38,490',
    change: '+31.7%',
    up: true,
    sub: 'vs last month',
    icon: Eye,
    color: 'from-pink-500 to-rose-600',
    bg: 'from-pink-50 to-rose-50',
    border: 'border-pink-200',
  },
  {
    label: 'Avg. Rating',
    value: '4.7 / 5',
    change: '+0.2',
    up: true,
    sub: 'from 6,210 reviews',
    icon: Star,
    color: 'from-yellow-400 to-amber-500',
    bg: 'from-yellow-50 to-amber-50',
    border: 'border-yellow-200',
  },
];

const revenueMonths = [
  { month: 'Jan', revenue: 820000, orders: 1420 },
  { month: 'Feb', revenue: 1050000, orders: 1750 },
  { month: 'Mar', revenue: 980000, orders: 1620 },
  { month: 'Apr', revenue: 1340000, orders: 2100 },
  { month: 'May', revenue: 1580000, orders: 2480 },
  { month: 'Jun', revenue: 1420000, orders: 2190 },
  { month: 'Jul', revenue: 1842390, orders: 3824 },
];

const topProducts = [
  { name: 'Forest Raw Honey (500g)', sales: 892, revenue: '₹5,79,608', growth: 18.2 },
  { name: 'A2 Gir Cow Ghee (500ml)', sales: 614, revenue: '₹5,51,586', growth: 12.7 },
  { name: 'Lakadong Turmeric (250g)', sales: 1203, revenue: '₹4,19,847', growth: 28.4 },
  { name: 'Cold Pressed Coconut Oil (1L)', sales: 731, revenue: '₹3,64,769', growth: -4.1 },
  { name: 'Organic Foxtail Millet (1kg)', sales: 955, revenue: '₹2,37,795', growth: 9.6 },
];

const categoryShare = [
  { name: 'Honey & Sweeteners', pct: 28, color: '#10b981' },
  { name: 'Oils & Ghee', pct: 24, color: '#6366f1' },
  { name: 'Spices', pct: 18, color: '#f59e0b' },
  { name: 'Millets & Grains', pct: 15, color: '#ec4899' },
  { name: 'Pickles & Others', pct: 15, color: '#8b5cf6' },
];

const recentOrders = [
  { id: '#NK-10482', customer: 'Priya Sharma', amount: '₹1,248', status: 'Delivered', date: 'Today, 9:14 AM' },
  { id: '#NK-10481', customer: 'Rohan Gupta', amount: '₹649', status: 'Shipped', date: 'Today, 8:02 AM' },
  { id: '#NK-10480', customer: 'Ananya Nair', amount: '₹2,197', status: 'Processing', date: 'Yesterday' },
  { id: '#NK-10479', customer: 'Kiran Reddy', amount: '₹499', status: 'Delivered', date: 'Yesterday' },
  { id: '#NK-10478', customer: 'Meena Iyer', amount: '₹3,596', status: 'Cancelled', date: '2 days ago' },
];

const statusColor: Record<string, string> = {
  Delivered: 'bg-emerald-100 text-emerald-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Processing: 'bg-amber-100 text-amber-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const maxRevenue = Math.max(...revenueMonths.map((m) => m.revenue));

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.35 },
});

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <motion.div {...fade()} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-50 to-violet-100">
              <BarChart2 className="h-4 w-4 text-violet-600" />
            </div>
            <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">Insights</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">Business performance overview — July 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>Last 7 months</span>
          </div>
        </div>
      </motion.div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} {...fade(i * 0.06)}
              className={cn(
                'rounded-2xl border bg-gradient-to-br p-4 shadow-sm',
                card.bg, card.border,
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm', card.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className={cn(
                  'flex items-center gap-0.5 text-xs font-bold rounded-full px-2 py-0.5',
                  card.up ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                )}>
                  {card.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {card.change}
                </span>
              </div>
              <p className="mt-3 text-xl font-extrabold text-gray-900 leading-none">{card.value}</p>
              <p className="mt-1 text-xs font-semibold text-gray-600">{card.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{card.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Revenue Chart + Category Pie ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Bar chart */}
        <motion.div {...fade(0.2)} className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-900">Monthly Revenue</h3>
              <p className="text-xs text-gray-400 mt-0.5">Jan – Jul 2026</p>
            </div>
            <Activity className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="flex items-end gap-2 h-40">
            {revenueMonths.map((m) => {
              const heightPct = Math.round((m.revenue / maxRevenue) * 100);
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[9px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                    ₹{(m.revenue / 100000).toFixed(1)}L
                  </span>
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all duration-500 hover:from-emerald-600 hover:to-emerald-500 shadow-sm"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] text-gray-500 font-medium">{m.month}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Category pie / donut */}
        <motion.div {...fade(0.25)} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900">Category Share</h3>
              <p className="text-xs text-gray-400 mt-0.5">Revenue split</p>
            </div>
            <PieChart className="h-5 w-5 text-violet-500" />
          </div>
          <div className="space-y-3">
            {categoryShare.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700 truncate max-w-[140px]">{cat.name}</span>
                  <span className="font-bold text-gray-900 shrink-0">{cat.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.pct}%` }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Top Products + Recent Orders ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Top products */}
        <motion.div {...fade(0.3)} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-4">
            <h3 className="font-bold text-gray-900">Top Products</h3>
            <p className="text-xs text-gray-400 mt-0.5">By revenue this month</p>
          </div>
          <div className="divide-y divide-gray-50">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
                <span className="text-xs font-bold text-gray-300 w-4 shrink-0">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                  <p className="text-[11px] text-gray-400">{p.sales} units sold</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">{p.revenue}</p>
                  <span className={cn(
                    'text-[10px] font-bold flex items-center justify-end gap-0.5',
                    p.growth >= 0 ? 'text-emerald-600' : 'text-red-500'
                  )}>
                    {p.growth >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {Math.abs(p.growth)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent orders */}
        <motion.div {...fade(0.35)} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Recent Orders</h3>
              <p className="text-xs text-gray-400 mt-0.5">Latest transactions</p>
            </div>
            <Package className="h-4 w-4 text-gray-400" />
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-gray-500">{order.id}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{order.customer}</p>
                  <p className="text-[11px] text-gray-400">{order.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">{order.amount}</p>
                  <span className={cn('text-[10px] font-semibold rounded-full px-2 py-0.5', statusColor[order.status])}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
