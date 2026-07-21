'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Truck, Search, Eye, CheckCircle2, XCircle, Clock,
  Package, MapPin, AlertTriangle, Calendar, RefreshCw, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const SHIPMENTS = [
  {
    id: 'SHP-10482', orderId: '#NK-10482', customer: 'Priya Sharma', phone: '+91 98451 12340',
    address: '14/3 Indiranagar, Bengaluru, Karnataka 560038',
    items: 'Forest Raw Honey (500g) × 2', amount: '₹1,298',
    carrier: 'Delhivery', trackingNo: 'DEL4820194731', status: 'Delivered',
    estimatedDate: '2026-07-19', deliveredDate: '2026-07-19', weight: '1.2 kg',
  },
  {
    id: 'SHP-10481', orderId: '#NK-10481', customer: 'Rohan Gupta', phone: '+91 99871 43210',
    address: '7 Powai, Mumbai, Maharashtra 400076',
    items: 'A2 Gir Cow Ghee (500ml) × 1', amount: '₹899',
    carrier: 'Delhivery', trackingNo: 'DEL4820194730', status: 'In Transit',
    estimatedDate: '2026-07-22', deliveredDate: null, weight: '0.6 kg',
  },
  {
    id: 'SHP-10480', orderId: '#NK-10480', customer: 'Ananya Nair', phone: '+91 87654 32100',
    address: '22 Banjara Hills, Hyderabad, Telangana 500034',
    items: 'Lakadong Turmeric (250g) × 3 + Cold Pressed Coconut Oil', amount: '₹2,544',
    carrier: 'Blue Dart', trackingNo: 'BD9820174620', status: 'Processing',
    estimatedDate: '2026-07-24', deliveredDate: null, weight: '2.1 kg',
  },
  {
    id: 'SHP-10479', orderId: '#NK-10479', customer: 'Kiran Reddy', phone: '+91 76543 21000',
    address: '5 Anna Nagar, Chennai, Tamil Nadu 600040',
    items: 'Cold Pressed Coconut Oil (1L) × 1', amount: '₹499',
    carrier: 'DTDC', trackingNo: 'DTDC7820100412', status: 'Delivered',
    estimatedDate: '2026-07-20', deliveredDate: '2026-07-21', weight: '1.0 kg',
  },
  {
    id: 'SHP-10478', orderId: '#NK-10478', customer: 'Meena Iyer', phone: '+91 65432 10900',
    address: '3/A Connaught Place, New Delhi 110001',
    items: 'Himalayan Raw Honey × 2 + Organic Jaggery × 2 + Millet Pack', amount: '₹3,596',
    carrier: 'Delhivery', trackingNo: 'DEL4820194728', status: 'Cancelled',
    estimatedDate: '2026-07-21', deliveredDate: null, weight: '3.5 kg',
  },
  {
    id: 'SHP-10477', orderId: '#NK-10477', customer: 'Arun Verma', phone: '+91 54321 09800',
    address: '88 MG Road, Pune, Maharashtra 411001',
    items: 'Organic Foxtail Millet (1kg) × 2', amount: '₹498',
    carrier: 'Ekart', trackingNo: 'EK9820174601', status: 'Out for Delivery',
    estimatedDate: '2026-07-21', deliveredDate: null, weight: '2.0 kg',
  },
];

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType; dot: string }> = {
  Delivered:       { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2, dot: 'bg-emerald-500' },
  'In Transit':    { color: 'bg-blue-100 text-blue-700 border-blue-200',         icon: Truck,        dot: 'bg-blue-500' },
  Processing:      { color: 'bg-amber-100 text-amber-700 border-amber-200',       icon: Clock,        dot: 'bg-amber-500' },
  'Out for Delivery': { color: 'bg-violet-100 text-violet-700 border-violet-200', icon: MapPin,       dot: 'bg-violet-500' },
  Cancelled:       { color: 'bg-red-100 text-red-700 border-red-200',             icon: XCircle,      dot: 'bg-red-500' },
};

const STATUSES = ['All', 'Processing', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled'];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

export default function AdminShipmentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = SHIPMENTS.filter(s =>
    (statusFilter === 'All' || s.status === statusFilter) &&
    (s.customer.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.trackingNo.toLowerCase().includes(search.toLowerCase()))
  );

  const counts = Object.fromEntries(
    STATUSES.slice(1).map(st => [st, SHIPMENTS.filter(s => s.status === st).length])
  );

  return (
    <div className="space-y-5">

      {/* Header */}
      <motion.div {...fade()} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-sky-100">
              <Truck className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Logistics</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} of {SHIPMENTS.length} shipments</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 h-9 shrink-0">
          <RefreshCw className="h-3.5 w-3.5" /> Sync Tracking
        </Button>
      </motion.div>

      {/* Status summary cards */}
      <motion.div {...fade(0.06)} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {STATUSES.slice(1).map((st) => {
          const cfg = STATUS_CONFIG[st];
          const Icon = cfg.icon;
          return (
            <button key={st} onClick={() => setStatusFilter(st === statusFilter ? 'All' : st)}
              className={cn(
                'rounded-xl border p-3 text-center transition-all hover:shadow-sm',
                statusFilter === st ? cfg.color + ' shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
              )}>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <div className={cn('h-2 w-2 rounded-full', cfg.dot)} />
                <span className={cn('text-xl font-extrabold', statusFilter === st ? '' : 'text-gray-800')}>
                  {counts[st] || 0}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-gray-500 leading-tight">{st}</p>
            </button>
          );
        })}
      </motion.div>

      {/* Search */}
      <motion.div {...fade(0.1)}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search by customer, shipment ID or tracking number…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-gray-200 bg-white focus:border-blue-400" />
        </div>
      </motion.div>

      {/* Shipment cards */}
      <div className="space-y-3">
        {filtered.map((s, i) => {
          const cfg = STATUS_CONFIG[s.status] || STATUS_CONFIG['Processing'];
          const StatusIcon = cfg.icon;
          return (
            <motion.div key={s.id} {...fade(i * 0.04)}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Left: IDs */}
                <div className="sm:w-40 shrink-0">
                  <p className="text-xs font-mono font-bold text-gray-500">{s.id}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Order: {s.orderId}</p>
                  <Badge className={cn('mt-2 text-[10px] border gap-1', cfg.color)}>
                    <StatusIcon className="h-2.5 w-2.5" />
                    {s.status}
                  </Badge>
                </div>

                {/* Middle: Customer + items */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{s.customer}</p>
                      <p className="text-xs text-gray-500">{s.phone}</p>
                    </div>
                    <p className="text-sm font-extrabold text-gray-900 shrink-0">{s.amount}</p>
                  </div>
                  <div className="flex items-start gap-1.5 mt-2">
                    <MapPin className="h-3 w-3 text-gray-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-500 line-clamp-1">{s.address}</p>
                  </div>
                  <div className="flex items-start gap-1.5 mt-1">
                    <Package className="h-3 w-3 text-gray-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-600 line-clamp-1">{s.items}</p>
                  </div>
                </div>

                {/* Right: carrier + tracking */}
                <div className="sm:w-44 shrink-0">
                  <p className="text-xs text-gray-400">Carrier</p>
                  <p className="text-sm font-semibold text-gray-800">{s.carrier}</p>
                  <p className="text-[11px] font-mono text-gray-400 mt-1">{s.trackingNo}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <p className="text-[11px] text-gray-500">
                      {s.deliveredDate
                        ? <>Delivered <span className="font-semibold text-emerald-600">{s.deliveredDate}</span></>
                        : <>ETA: <span className="font-semibold text-gray-700">{s.estimatedDate}</span></>}
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">Weight: {s.weight}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-[11px] text-gray-400">
                  {s.status === 'Cancelled' && <span className="flex items-center gap-1 text-red-500"><AlertTriangle className="h-3 w-3" /> Order cancelled — shipment void</span>}
                  {s.status === 'Delivered' && <span className="text-emerald-600 font-medium">✓ Successfully delivered</span>}
                  {s.status === 'In Transit' && <span className="text-blue-600 font-medium">📍 On the way</span>}
                  {s.status === 'Out for Delivery' && <span className="text-violet-600 font-medium">🚚 Out for delivery today</span>}
                  {s.status === 'Processing' && <span className="text-amber-600 font-medium">⏳ Awaiting pickup</span>}
                </p>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-8 rounded-xl text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 gap-1">
                    <Eye className="h-3.5 w-3.5" /> Track
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400 rounded-2xl border border-gray-200 bg-white">
            <Truck className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No shipments found</p>
          </div>
        )}
      </div>
    </div>
  );
}
