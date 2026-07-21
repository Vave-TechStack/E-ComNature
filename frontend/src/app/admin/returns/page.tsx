'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Ticket, Search, CheckCircle2, XCircle, Clock, Package,
  AlertTriangle, RefreshCw, Eye, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const RETURNS = [
  {
    id: 'RET-1041', orderId: '#NK-10410', customer: 'Divya Krishnan', phone: '+91 98765 43210',
    product: 'A2 Gir Cow Ghee (500ml)', qty: 1, amount: '₹899', refundAmount: '₹899',
    reason: 'Product damaged during delivery — bottle cracked',
    status: 'Refund Issued', raisedOn: '2026-07-18', resolvedOn: '2026-07-20',
    refundMethod: 'Original Payment Method', image: true,
  },
  {
    id: 'RET-1039', orderId: '#NK-10400', customer: 'Suresh Babu', phone: '+91 87654 32109',
    product: 'Forest Raw Honey (500g)', qty: 2, amount: '₹1,298', refundAmount: '₹1,298',
    reason: 'Received wrong product — ordered 500g, got 250g',
    status: 'Processing', raisedOn: '2026-07-19', resolvedOn: null,
    refundMethod: 'Wallet Credit', image: true,
  },
  {
    id: 'RET-1037', orderId: '#NK-10390', customer: 'Lakshmi Patel', phone: '+91 76543 21098',
    product: 'Lakadong Turmeric Powder (250g)', qty: 1, amount: '₹349', refundAmount: '₹349',
    reason: 'Product quality not satisfactory — colour and smell different',
    status: 'Approved', raisedOn: '2026-07-17', resolvedOn: null,
    refundMethod: 'Original Payment Method', image: false,
  },
  {
    id: 'RET-1035', orderId: '#NK-10380', customer: 'Ravi Shankar', phone: '+91 65432 10987',
    product: 'Cold Pressed Coconut Oil (1L)', qty: 1, amount: '₹499', refundAmount: '₹0',
    reason: 'Changed mind — no longer needed',
    status: 'Rejected', raisedOn: '2026-07-16', resolvedOn: '2026-07-18',
    refundMethod: '—', image: false,
  },
  {
    id: 'RET-1033', orderId: '#NK-10370', customer: 'Anitha Rao', phone: '+91 54321 09876',
    product: 'Organic Foxtail Millet (1kg) × 2', qty: 2, amount: '₹498', refundAmount: '₹498',
    reason: 'Package damaged — millet spilled inside the box',
    status: 'Processing', raisedOn: '2026-07-20', resolvedOn: null,
    refundMethod: 'Wallet Credit', image: true,
  },
  {
    id: 'RET-1030', orderId: '#NK-10360', customer: 'Mohan Das', phone: '+91 43210 98765',
    product: 'Wood Pressed Sesame Oil (500ml)', qty: 1, amount: '₹399', refundAmount: '₹399',
    reason: 'Expiry date too close — only 2 months remaining',
    status: 'Refund Issued', raisedOn: '2026-07-14', resolvedOn: '2026-07-16',
    refundMethod: 'Original Payment Method', image: false,
  },
];

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType; dot: string }> = {
  'Refund Issued': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2, dot: 'bg-emerald-500' },
  Processing:      { color: 'bg-amber-100 text-amber-700 border-amber-200',       icon: Clock,         dot: 'bg-amber-500' },
  Approved:        { color: 'bg-blue-100 text-blue-700 border-blue-200',          icon: CheckCircle2,  dot: 'bg-blue-500' },
  Rejected:        { color: 'bg-red-100 text-red-700 border-red-200',             icon: XCircle,       dot: 'bg-red-500' },
};

const STATUSES = ['All', 'Processing', 'Approved', 'Refund Issued', 'Rejected'];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

export default function AdminReturnsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = RETURNS.filter(r =>
    (statusFilter === 'All' || r.status === statusFilter) &&
    (r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.product.toLowerCase().includes(search.toLowerCase()))
  );

  const totalRefunded = RETURNS
    .filter(r => r.status === 'Refund Issued')
    .reduce((s, r) => s + parseInt(r.refundAmount.replace(/[₹,]/g, '')), 0);

  return (
    <div className="space-y-5">

      {/* Header */}
      <motion.div {...fade()} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-50 to-red-100">
              <Ticket className="h-4 w-4 text-rose-600" />
            </div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">After-Sales</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Returns & Refunds</h1>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} of {RETURNS.length} requests</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 h-9 shrink-0">
          <RefreshCw className="h-3.5 w-3.5" /> Sync Status
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div {...fade(0.06)} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Requests', value: RETURNS.length, bg: 'bg-gray-50', color: 'text-gray-800' },
          { label: 'Processing', value: RETURNS.filter(r => r.status === 'Processing').length, bg: 'bg-amber-50', color: 'text-amber-700' },
          { label: 'Refunds Issued', value: RETURNS.filter(r => r.status === 'Refund Issued').length, bg: 'bg-emerald-50', color: 'text-emerald-700' },
          { label: 'Total Refunded', value: `₹${totalRefunded.toLocaleString()}`, bg: 'bg-red-50', color: 'text-red-700' },
        ].map((s) => (
          <div key={s.label} className={cn('rounded-xl border border-gray-200 p-3 text-center', s.bg)}>
            <p className={cn('text-xl font-extrabold', s.color)}>{s.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div {...fade(0.1)} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search by customer, return ID or product…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-gray-200 bg-white focus:border-rose-400" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((st) => (
            <button key={st} onClick={() => setStatusFilter(st)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap',
                statusFilter === st ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              )}>
              {st}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Return cards */}
      <div className="space-y-3">
        {filtered.map((ret, i) => {
          const cfg = STATUS_CONFIG[ret.status] || STATUS_CONFIG['Processing'];
          const StatusIcon = cfg.icon;
          return (
            <motion.div key={ret.id} {...fade(i * 0.04)}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Left: IDs + status */}
                <div className="sm:w-36 shrink-0">
                  <p className="text-xs font-mono font-bold text-gray-500">{ret.id}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Order: {ret.orderId}</p>
                  <Badge className={cn('mt-2 text-[10px] border gap-1', cfg.color)}>
                    <StatusIcon className="h-2.5 w-2.5" />
                    {ret.status}
                  </Badge>
                </div>

                {/* Middle: customer + product + reason */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{ret.customer}</p>
                  <p className="text-xs text-gray-500">{ret.phone}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Package className="h-3 w-3 text-gray-400 shrink-0" />
                    <p className="text-xs font-semibold text-gray-700">{ret.product} × {ret.qty}</p>
                  </div>
                  <div className="flex items-start gap-1.5 mt-1">
                    <AlertTriangle className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-500 italic">"{ret.reason}"</p>
                  </div>
                  {ret.image && (
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] text-blue-500 bg-blue-50 border border-blue-100 rounded-lg px-2 py-0.5">
                      📷 Photos attached
                    </span>
                  )}
                </div>

                {/* Right: amounts + dates */}
                <div className="sm:w-40 shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Order Amount</p>
                    <p className="text-sm font-bold text-gray-800">{ret.amount}</p>
                  </div>
                  <div className="text-right mt-2">
                    <p className="text-xs text-gray-400">Refund Amount</p>
                    <p className={cn(
                      'text-sm font-extrabold',
                      ret.refundAmount === '₹0' ? 'text-red-500' : 'text-emerald-600'
                    )}>
                      {ret.refundAmount}
                    </p>
                  </div>
                  {ret.refundMethod !== '—' && (
                    <p className="text-[11px] text-gray-400 text-right mt-1">{ret.refundMethod}</p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-4 text-[11px] text-gray-400">
                  <span>Raised: <span className="font-medium text-gray-600">{ret.raisedOn}</span></span>
                  {ret.resolvedOn && <span>Resolved: <span className="font-medium text-gray-600">{ret.resolvedOn}</span></span>}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-8 rounded-xl text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 gap-1.5">
                    <Eye className="h-3.5 w-3.5" /> View Details
                  </Button>
                  {ret.status === 'Processing' && (
                    <>
                      <Button size="sm" className="h-8 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs text-red-600 border-red-200 hover:bg-red-50 gap-1.5">
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400 rounded-2xl border border-gray-200 bg-white">
            <ArrowLeft className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No returns found</p>
          </div>
        )}
      </div>
    </div>
  );
}
