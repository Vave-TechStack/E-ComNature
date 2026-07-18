'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package,
  Clock, AlertTriangle, ArrowUpRight, ArrowDownRight, MoreHorizontal,
  Activity, Download, RefreshCw, FileText, Eye, CheckCircle, XCircle,
  CreditCard, Truck, ShoppingCart, AlertCircle, Zap, CalendarDays, Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart as RechartsBarChart
} from 'recharts';
import { formatPrice, cn } from '@/lib/utils';

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
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration, enabled]);

  return count;
}

const statCards = [
  { label: 'Total Revenue', value: 12456789, change: 12.5, trend: 'up', icon: DollarSign, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', format: (v: number) => formatPrice(v) },
  { label: 'Total Orders', value: 12456, change: 8.2, trend: 'up', icon: ShoppingBag, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', format: (v: number) => v.toLocaleString() },
  { label: 'Total Customers', value: 34256, change: -3.1, trend: 'down', icon: Users, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', format: (v: number) => v.toLocaleString() },
  { label: 'Active Products', value: 5678, change: 15.7, trend: 'up', icon: Package, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', format: (v: number) => v.toLocaleString() },
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

const iconColorMap: Record<string, string> = {
  blue: 'text-blue-600', emerald: 'text-emerald-600',
  purple: 'text-purple-600', orange: 'text-orange-600',
};

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

const topProducts = [
  { name: 'Wireless Headphones', sales: 3456, revenue: 6890000, growth: 23 },
  { name: 'Smart Watch Pro', sales: 2890, revenue: 11560000, growth: 45 },
  { name: 'Cotton T-Shirt Pack', sales: 5678, revenue: 7380000, growth: -5 },
  { name: 'DSLR Camera', sales: 1234, revenue: 9250000, growth: 12 },
  { name: 'Scented Candle Set', sales: 4567, revenue: 4560000, growth: 34 },
];

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
        <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.name === 'revenue' || entry.name === 'profit' ? formatPrice(entry.value) : entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ===== Animated Stat Card =====
function AnimatedStatCard({ stat: s }: { stat: typeof statCards[0] }) {
  const Icon = s.icon;
  const animatedValue = useCountUp(s.value);
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`h-5 w-5 ${iconColorMap[s.color.split('-')[1]] || 'text-gray-600'}`} />
        </div>
        <Badge variant={s.trend === 'up' ? 'secondary' : 'destructive'} className="gap-1 text-xs">
          {s.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(s.change)}%
        </Badge>
      </div>
      <p className="mt-4 text-2xl font-bold text-gray-900">
        {s.format(animatedValue)}
      </p>
      <p className="mt-1 text-sm text-gray-500">{s.label}</p>
      {/* Mini sparkline bar */}
      <div className="mt-3 h-1 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${s.color} transition-all duration-1000`} style={{ width: `${Math.min(100, (s.value / (s.value * 1.3)) * 100)}%` }} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [revenuePeriod, setRevenuePeriod] = useState<'yearly' | 'monthly'>('yearly');
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Your e-commerce performance at a glance</p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-2 px-2">
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shrink-0">
            {['7days', '30days', '90days', 'year'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={cn(
                  'px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap',
                  selectedPeriod === p ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                )}
              >
                {p === '7days' ? '7 Days' : p === '30days' ? '30 Days' : p === '90days' ? '90 Days' : 'Year'}
              </button>
            ))}
          </div>
          <Button size="sm" variant="outline" className="gap-2 shrink-0">
            <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards with Animated Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <AnimatedStatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Daily Comparison */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(dailyComparison.today).map(([key, value]) => {
          const yesterday = dailyComparison.yesterday[key as keyof typeof dailyComparison.yesterday];
          const diff = ((value - yesterday) / yesterday) * 100;
          const isPositive = diff >= 0;
          return (
            <div key={key} className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 capitalize">{key} <span className="text-[10px] text-gray-400">(today)</span></p>
                <Badge className={cn('gap-0.5 text-[10px]', isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>
                  {isPositive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                  {Math.abs(diff).toFixed(1)}%
                </Badge>
              </div>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {key === 'revenue' ? formatPrice(value) : key === 'conversion' ? `${value}%` : value.toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-400">Yesterday: {key === 'revenue' ? formatPrice(yesterday) : key === 'conversion' ? `${yesterday}%` : yesterday}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Revenue Overview</h3>
              <p className="text-sm text-gray-500">Monthly revenue and profit trends</p>
            </div>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => setRevenuePeriod('yearly')}
                className={cn(
                  'px-2.5 sm:px-3 py-1 text-xs font-medium rounded-md transition-all',
                  revenuePeriod === 'yearly' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
                )}
              >
                Yearly
              </button>
              <button
                onClick={() => setRevenuePeriod('monthly')}
                className={cn(
                  'px-2.5 sm:px-3 py-1 text-xs font-medium rounded-md transition-all',
                  revenuePeriod === 'monthly' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
                )}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#revenueGradient)" strokeWidth={2} name="revenue" />
                <Area type="monotone" dataKey="profit" stroke="#22c55e" fill="url(#profitGradient)" strokeWidth={2} name="profit" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders by Status Pie */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-2">Orders by Status</h3>
          <p className="text-sm text-gray-500 mb-6">Distribution of order statuses</p>
          <div className="flex flex-col items-center justify-center">
            <div className="h-56 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {orderStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-2 w-full max-w-sm">
              {orderStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-medium text-gray-900 ml-auto">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="rounded-xl border border-red-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="text-base font-semibold text-gray-900">Low Stock Alerts</h3>
          </div>
          <Badge className="bg-red-50 text-red-700 border-red-200">{lowStockItems.length} items</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {lowStockItems.map((item) => {
            const stockPercent = Math.round((item.stock / item.threshold) * 100);
            const isCritical = item.stock <= 5;
            return (
              <Link key={item.sku} href={`/admin/products?sku=${item.sku}`} className="block rounded-xl border border-red-100 bg-red-50/50 p-3 hover:bg-red-50 transition-colors group">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-red-600 transition-colors">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.category} · {item.sku}</p>
                  </div>
                  <Badge className={cn(isCritical ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700')}>
                    {item.stock} left
                  </Badge>
                </div>
                <Progress value={stockPercent} className={cn('h-1.5', isCritical ? '[&>div]:bg-red-500' : '[&>div]:bg-amber-500')} />
                <p className="mt-1.5 text-[10px] text-gray-400">Threshold: {item.threshold} units — {stockPercent}% of stock level</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Recent Orders</h3>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">View All →</Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Order</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Items</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2 font-medium text-gray-900">{order.id}</td>
                    <td className="py-3 px-2 text-gray-600">{order.customer}</td>
                    <td className="py-3 px-2 text-gray-600">{order.items}</td>
                    <td className="py-3 px-2 font-medium text-gray-900">{formatPrice(order.amount)}</td>
                    <td className="py-3 px-2">
                      <Badge className={
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary-600" />
              <h3 className="text-base font-semibold text-gray-900">Activity</h3>
            </div>
            <Badge className="bg-primary-50 text-primary-700 border-0">{recentActivities.length} new</Badge>
          </div>
          <div className="space-y-0">
            {recentActivities.map((act, i) => {
              const Icon = (activityIcons[act.type] || Activity) as React.ComponentType<{ className?: string }>;
              const iconColors: Record<string, string> = {
                order: 'text-blue-500 bg-blue-50',
                payment: 'text-green-500 bg-green-50',
                alert: 'text-red-500 bg-red-50',
                shipping: 'text-purple-500 bg-purple-50',
                user: 'text-primary-500 bg-primary-50',
                return: 'text-orange-500 bg-orange-50',
                coupon: 'text-amber-500 bg-amber-50',
              };
              return (
                <div key={i} className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconColors[act.type] || 'bg-gray-50 text-gray-500'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{act.action}</p>
                    <p className="text-xs text-gray-500 truncate">{act.detail}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">{act.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
