'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Eye, ChevronDown, Clock, MapPin, CreditCard, CheckCircle, Truck, PackageCheck, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatPrice, formatDate } from '@/lib/utils';

interface OrderItem {
  id: number;
  name: string;
  qty: number;
  price: number;
  image: string;
}

interface OrderStatus {
  label: string;
  date: string;
  completed: boolean;
  icon: typeof Clock;
}

interface Order {
  id: string;
  date: string;
  status: string;
  items: number;
  total: number;
  payment: string;
  deliveryDate: string;
  address: string;
  orderItems: OrderItem[];
  timeline: OrderStatus[];
}

const orders: Order[] = [
  {
    id: 'ORD-45689', date: '2026-01-15T10:30:00', status: 'Delivered', items: 3, total: 12499, payment: 'Paid',
    deliveryDate: '18 Jan 2026', address: '42, MG Road, Indiranagar, Bangalore - 560038',
    orderItems: [
      { id: 1, name: 'Forest Raw Honey (500g)', qty: 2, price: 649, image: '🍯' },
      { id: 2, name: 'Organic Foxtail Millet (1kg)', qty: 1, price: 249, image: '🌾' },
      { id: 3, name: 'Cold Pressed Coconut Oil (1L)', qty: 1, price: 499, image: '🫒' },
    ],
    timeline: [
      { label: 'Order Placed', date: '15 Jan, 10:30 AM', completed: true, icon: ShoppingBag },
      { label: 'Payment Confirmed', date: '15 Jan, 10:32 AM', completed: true, icon: CreditCard },
      { label: 'Processing', date: '16 Jan, 09:00 AM', completed: true, icon: Loader2 },
      { label: 'Shipped', date: '17 Jan, 02:00 PM', completed: true, icon: Truck },
      { label: 'Delivered', date: '18 Jan, 11:45 AM', completed: true, icon: PackageCheck },
    ],
  },
  {
    id: 'ORD-45690', date: '2026-01-14T14:45:00', status: 'Processing', items: 1, total: 4599, payment: 'Pending',
    deliveryDate: 'Expected by 20 Jan', address: '91, Richmond Road, Ashok Nagar, Bangalore - 560025',
    orderItems: [
      { id: 4, name: 'A2 Gir Cow Ghee (500ml)', qty: 1, price: 899, image: '🧈' },
    ],
    timeline: [
      { label: 'Order Placed', date: '14 Jan, 2:45 PM', completed: true, icon: ShoppingBag },
      { label: 'Payment Confirmed', date: '14 Jan, 2:47 PM', completed: true, icon: CreditCard },
      { label: 'Processing', date: '15 Jan, 10:00 AM', completed: true, icon: Loader2 },
      { label: 'Shipped', date: '—', completed: false, icon: Truck },
      { label: 'Delivered', date: '—', completed: false, icon: PackageCheck },
    ],
  },
  {
    id: 'ORD-45691', date: '2026-01-12T09:15:00', status: 'Shipped', items: 5, total: 28999, payment: 'Paid',
    deliveryDate: 'Expected by 16 Jan', address: '42, MG Road, Indiranagar, Bangalore - 560038',
    orderItems: [
      { id: 5, name: 'Lakadong Turmeric Powder (250g)', qty: 2, price: 349, image: '🟡' },
      { id: 6, name: 'Organic Palm Jaggery (500g)', qty: 1, price: 179, image: '🟤' },
      { id: 7, name: 'Herbal Green Tea (100g)', qty: 1, price: 349, image: '🍵' },
      { id: 8, name: 'Traditional Mango Pickle (400g)', qty: 1, price: 199, image: '🥭' },
    ],
    timeline: [
      { label: 'Order Placed', date: '12 Jan, 9:15 AM', completed: true, icon: ShoppingBag },
      { label: 'Payment Confirmed', date: '12 Jan, 9:17 AM', completed: true, icon: CreditCard },
      { label: 'Processing', date: '13 Jan, 08:00 AM', completed: true, icon: Loader2 },
      { label: 'Shipped', date: '14 Jan, 03:30 PM', completed: true, icon: Truck },
      { label: 'Delivered', date: '—', completed: false, icon: PackageCheck },
    ],
  },
  {
    id: 'ORD-45692', date: '2026-01-10T16:00:00', status: 'Cancelled', items: 2, total: 8999, payment: 'Refunded',
    deliveryDate: '—', address: '91, Richmond Road, Ashok Nagar, Bangalore - 560025',
    orderItems: [
      { id: 9, name: 'Organic Raw Cashews (500g)', qty: 1, price: 749, image: '🥜' },
      { id: 10, name: 'Assam Organic Black Tea (250g)', qty: 1, price: 299, image: '🫖' },
    ],
    timeline: [
      { label: 'Order Placed', date: '10 Jan, 4:00 PM', completed: true, icon: ShoppingBag },
      { label: 'Cancelled', date: '10 Jan, 4:30 PM', completed: true, icon: PackageCheck },
      { label: 'Refund Processed', date: '11 Jan, 10:00 AM', completed: true, icon: CreditCard },
    ],
  },
  {
    id: 'ORD-45693', date: '2026-01-08T11:20:00', status: 'Delivered', items: 4, total: 19999, payment: 'Paid',
    deliveryDate: '12 Jan 2026', address: '42, MG Road, Indiranagar, Bangalore - 560038',
    orderItems: [
      { id: 11, name: 'Araku Valley Coffee Beans (500g)', qty: 1, price: 499, image: '☕' },
      { id: 12, name: 'Organic Brown Rice (2kg)', qty: 2, price: 199, image: '🍚' },
    ],
    timeline: [
      { label: 'Order Placed', date: '8 Jan, 11:20 AM', completed: true, icon: ShoppingBag },
      { label: 'Payment Confirmed', date: '8 Jan, 11:22 AM', completed: true, icon: CreditCard },
      { label: 'Processing', date: '9 Jan, 09:00 AM', completed: true, icon: Loader2 },
      { label: 'Shipped', date: '10 Jan, 02:00 PM', completed: true, icon: Truck },
      { label: 'Delivered', date: '12 Jan, 03:30 PM', completed: true, icon: PackageCheck },
    ],
  },
];

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700', Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700', Pending: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const statusGlow: Record<string, string> = {
  Delivered: 'shadow-green-200', Processing: 'shadow-blue-200',
  Shipped: 'shadow-purple-200', Cancelled: 'shadow-red-200',
};

// === Order Timeline Component ===
function OrderTimeline({ timeline, status }: { timeline: OrderStatus[]; status: string }) {
  const isCancelled = status === 'Cancelled';
  return (
    <div className="relative py-2">
      {timeline.map((step, i) => {
        const Icon = step.icon;
        const isLast = i === timeline.length - 1;
        return (
          <div key={step.label} className="flex gap-4 pb-6 last:pb-0 relative">
            {/* Timeline line */}
            {!isLast && (
              <div className={cn(
                'absolute left-[15px] top-8 w-0.5 h-full',
                step.completed ? 'bg-primary-300' : 'bg-gray-200'
              )} />
            )}
            {/* Icon circle */}
            <div className={cn(
              'relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full z-10',
              isCancelled && step.label === 'Cancelled' ? 'bg-red-100 text-red-600' :
              step.completed ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'
            )}>
              <Icon className="h-4 w-4" />
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <p className={cn(
                'text-sm font-medium',
                step.completed ? 'text-gray-900' : 'text-gray-400'
              )}>
                {step.label}
              </p>
              <p className={cn('text-xs', step.completed ? 'text-gray-500' : 'text-gray-300')}>
                {step.date}
              </p>
            </div>
            {step.completed && !isCancelled && (
              <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// === Main Page ===
export default function ProfileOrdersPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
          <p className="text-sm text-gray-500">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16">
          <Package className="h-12 w-12 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-900">No orders yet</p>
          <p className="text-xs text-gray-500 mt-1">Your order history will appear here</p>
          <Link href="/products"><Button className="mt-4 gradient-primary">Start Shopping</Button></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            return (
              <motion.div
                key={order.id}
                layout
                className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-sm transition-shadow"
              >
                {/* Order Summary Header */}
                <button
                  onClick={() => toggleExpand(order.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg',
                      order.status === 'Delivered' ? 'bg-green-50' :
                      order.status === 'Cancelled' ? 'bg-red-50' : 'bg-primary-50'
                    )}>
                      <Package className={cn(
                        'h-5 w-5',
                        order.status === 'Delivered' ? 'text-green-600' :
                        order.status === 'Cancelled' ? 'text-red-500' : 'text-primary-600'
                      )} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.date)} · {order.items} item{order.items > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</p>
                      <Badge className={cn('text-xs', statusColors[order.status] || 'bg-gray-100 text-gray-700')}>
                        {order.status}
                      </Badge>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-gray-400"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </div>
                </button>

                {/* Mobile status row */}
                <div className="sm:hidden px-4 pb-3 flex items-center justify-between">
                  <Badge className={cn('text-xs', statusColors[order.status] || 'bg-gray-100 text-gray-700')}>
                    {order.status}
                  </Badge>
                  <span className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</span>
                </div>

                {/* Expanded Timeline */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden border-t border-gray-100"
                    >
                      <div className="p-4 sm:p-5 space-y-5">
                        {/* Timeline */}
                        <div className="rounded-xl bg-gray-50/80 p-4">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            Order Timeline
                          </h4>
                          <OrderTimeline timeline={order.timeline} status={order.status} />
                        </div>

                        {/* Delivery Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-gray-500">Delivery Address</p>
                              <p className="text-sm text-gray-900">{order.address}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">
                            <CreditCard className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-gray-500">Payment</p>
                              <p className="text-sm text-gray-900">{order.payment}</p>
                              <p className="text-xs text-gray-400">Delivery: {order.deliveryDate}</p>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Items ({order.items})</h4>
                          <div className="space-y-2">
                            {order.orderItems.map((item) => (
                              <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                                <div className="flex items-center gap-3">
                                  <span className="text-xl">{item.image}</span>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                  </div>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">{formatPrice(item.price * item.qty)}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Link href={`/orders/${order.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full gap-2">
                              <Eye className="h-4 w-4" /> View Details
                            </Button>
                          </Link>
                          <Link href={`/orders/${order.id}/invoice`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full gap-2">
                              <Package className="h-4 w-4" /> Invoice
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
