'use client';

import { motion } from 'framer-motion';
import {
  FileText, Download, TrendingUp, ShoppingCart, Users, Package,
  BarChart2, PieChart, ArrowUpRight, ArrowDownRight, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const REPORTS = [
  { title: 'Sales Summary', desc: 'Revenue, orders, AOV by date range', icon: TrendingUp, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { title: 'Order Report', desc: 'Order status, fulfilment rate, returns', icon: ShoppingCart, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { title: 'Customer Report', desc: 'New vs returning, LTV, segments', icon: Users, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', border: 'border-violet-200' },
  { title: 'Inventory Report', desc: 'Stock levels, low stock alerts, turnover', icon: Package, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { title: 'Product Performance', desc: 'Views, conversion, revenue per product', icon: BarChart2, color: 'from-pink-500 to-rose-600', bg: 'bg-pink-50', border: 'border-pink-200' },
  { title: 'Category Breakdown', desc: 'Revenue split across product categories', icon: PieChart, color: 'from-teal-500 to-cyan-600', bg: 'bg-teal-50', border: 'border-teal-200' },
];

const MONTHLY_SUMMARY = [
  { metric: 'Total Revenue', current: '₹18,42,390', prev: '₹16,08,200', change: 14.6, up: true },
  { metric: 'Total Orders', current: '3,824', prev: '3,531', change: 8.3, up: true },
  { metric: 'New Customers', current: '1,248', prev: '986', change: 26.6, up: true },
  { metric: 'Avg Order Value', current: '₹481', prev: '₹498', change: 3.4, up: false },
  { metric: 'Return Rate', current: '2.1%', prev: '2.8%', change: 25.0, up: true },
  { metric: 'Cancelled Orders', current: '94', prev: '112', change: 16.1, up: true },
];

const TOP_CITIES = [
  { city: 'Bengaluru', orders: 921, revenue: '₹4,52,840', pct: 100 },
  { city: 'Mumbai', orders: 684, revenue: '₹3,28,960', pct: 73 },
  { city: 'Hyderabad', orders: 523, revenue: '₹2,49,220', pct: 55 },
  { city: 'Chennai', orders: 412, revenue: '₹1,98,160', pct: 44 },
  { city: 'Delhi', orders: 389, revenue: '₹1,87,720', pct: 42 },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div {...fade()} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
              <FileText className="h-4 w-4 text-gray-600" />
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Data</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-400 mt-0.5">Business insights and downloadable reports</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>July 2026</span>
          </div>
          <Button className="gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white rounded-xl h-9 shrink-0">
            <Download className="h-3.5 w-3.5" /> Export All
          </Button>
        </div>
      </motion.div>

      {/* Monthly KPI table */}
      <motion.div {...fade(0.08)} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-bold text-gray-900">Monthly Summary — July 2026</h2>
          <p className="text-xs text-gray-400 mt-0.5">Compared to June 2026</p>
        </div>
        <div className="divide-y divide-gray-50">
          {MONTHLY_SUMMARY.map((row) => (
            <div key={row.metric} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
              <p className="text-sm font-semibold text-gray-700">{row.metric}</p>
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-400">Last month</p>
                  <p className="text-sm text-gray-500">{row.prev}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">This month</p>
                  <p className="text-sm font-bold text-gray-900">{row.current}</p>
                </div>
                <span className={cn(
                  'flex items-center gap-0.5 text-xs font-bold rounded-full px-2 py-0.5 shrink-0',
                  row.up ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                )}>
                  {row.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {row.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top cities + downloadable reports side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Top cities */}
        <motion.div {...fade(0.14)} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-bold text-gray-900">Top Cities</h2>
            <p className="text-xs text-gray-400 mt-0.5">By revenue this month</p>
          </div>
          <div className="p-5 space-y-4">
            {TOP_CITIES.map((city, i) => (
              <div key={city.city}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-300 w-4">#{i + 1}</span>
                    <span className="font-semibold text-gray-800">{city.city}</span>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <span className="text-xs text-gray-400">{city.orders} orders</span>
                    <span className="font-bold text-gray-900">{city.revenue}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${city.pct}%` }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.05 }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Downloadable reports */}
        <motion.div {...fade(0.18)} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-bold text-gray-900">Download Reports</h2>
            <p className="text-xs text-gray-400 mt-0.5">Export detailed data as CSV/PDF</p>
          </div>
          <div className="p-4 space-y-2">
            {REPORTS.map((report) => {
              const Icon = report.icon;
              return (
                <div key={report.title}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-3.5 hover:shadow-sm transition-all cursor-pointer group',
                    report.bg, report.border
                  )}
                >
                  <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white', report.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{report.title}</p>
                    <p className="text-xs text-gray-500 truncate">{report.desc}</p>
                  </div>
                  <Button variant="ghost" size="icon"
                    className="h-8 w-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white/80 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
