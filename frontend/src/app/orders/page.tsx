'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Search, ChevronRight, Clock, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatPrice, formatDate } from '@/lib/utils';

const orders = [
  { id: 'ORD-45689', date: '2026-01-15T10:30:00', status: 'Delivered', items: 3, total: 12499, payment: 'Paid', tracking: 'FDX-789456123' },
  { id: 'ORD-45690', date: '2026-01-14T14:45:00', status: 'Processing', items: 1, total: 4599, payment: 'Pending', tracking: '' },
  { id: 'ORD-45691', date: '2026-01-12T09:15:00', status: 'Shipped', items: 5, total: 28999, payment: 'Paid', tracking: 'FDX-789456124' },
  { id: 'ORD-45692', date: '2026-01-10T16:00:00', status: 'Pending', items: 2, total: 8999, payment: 'Unpaid', tracking: '' },
  { id: 'ORD-45693', date: '2026-01-08T11:20:00', status: 'Delivered', items: 4, total: 19999, payment: 'Paid', tracking: 'FDX-789456125' },
  { id: 'ORD-45694', date: '2026-01-05T13:10:00', status: 'Cancelled', items: 1, total: 2999, payment: 'Refunded', tracking: '' },
  { id: 'ORD-45695', date: '2026-01-03T08:45:00', status: 'Delivered', items: 6, total: 45999, payment: 'Paid', tracking: 'FDX-789456126' },
];

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
  Returned: 'bg-gray-100 text-gray-700',
};

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="container-custom py-6">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-1 text-sm text-gray-500">Track, manage, and view your orders</p>
        </div>
      </div>

      <div className="container-custom py-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search by order ID..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Order List */}
        {filteredOrders.length === 0 ? (
          <div className="py-16">
            <EmptyState
              icon="orders"
              title={search ? 'No orders found' : 'No orders yet'}
              description={search ? 'Try searching with a different order ID or filter.' : 'When you place your first order, it will appear here.'}               actions={[{ label: search ? 'Clear Search' : 'Start Shopping', href: search ? '/orders' : '/products', variant: 'default' }]}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <Link href={`/orders/${order.id}`} className="block">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                        <Package className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                        <p className="text-xs text-gray-500">Placed on {formatDate(order.date)}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {order.items} items</span>
                          <span className="flex items-center gap-1"><CreditCard className="h-3 w-3" /> {order.payment}</span>
                          {order.tracking && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Trackable</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-base font-bold text-gray-900">{formatPrice(order.total)}</p>
                        <Badge className={`mt-1 text-xs ${statusColors[order.status]}`}>{order.status}</Badge>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
