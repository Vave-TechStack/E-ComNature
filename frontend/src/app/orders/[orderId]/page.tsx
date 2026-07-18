'use client';

import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, XCircle, MapPin, CreditCard, FileText, ChevronLeft, Download } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PriceBreakdown } from '@/components/cart/PriceBreakdown';
import { formatPrice, formatDate } from '@/lib/utils';

const timeline = [
  { id: 1, status: 'Order Placed', description: 'Your order has been placed successfully', date: 'Jan 15, 2026 - 10:30 AM', completed: true, icon: Package },
  { id: 2, status: 'Payment Confirmed', description: 'Payment has been received and verified', date: 'Jan 15, 2026 - 10:32 AM', completed: true, icon: CreditCard },
  { id: 3, status: 'Processing', description: 'Seller is preparing your order', date: 'Jan 15, 2026 - 02:15 PM', completed: true, icon: Clock },
  { id: 4, status: 'Packed', description: 'Your order has been packed and ready for shipping', date: 'Jan 16, 2026 - 11:00 AM', completed: true, icon: Package },
  { id: 5, status: 'Shipped', description: 'Your order has been shipped via FedEx', date: 'Jan 16, 2026 - 04:30 PM', completed: true, icon: Truck },
  { id: 6, status: 'Out for Delivery', description: 'Delivery partner is on the way', date: 'Jan 18, 2026 - 08:00 AM', completed: false, icon: MapPin },
  { id: 7, status: 'Delivered', description: 'Package delivered successfully', date: 'Expected Jan 18-19', completed: false, icon: CheckCircle },
];

const orderItems = [
  { name: 'Wireless Noise Cancelling Headphones', image: '/images/placeholder.svg', qty: 1, price: 19990, sku: 'WH-1000XM5' },
  { name: 'Premium Cotton T-Shirt (Pack of 3)', image: '/images/placeholder.svg', qty: 2, price: 1299, sku: 'CT-3PK-001' },
];

export default function OrderDetailPage() {
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="container-custom py-4 flex items-center gap-4">
          <Link href="/orders">
            <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Order #ORD-45689</h1>
            <p className="text-sm text-gray-500">Placed on January 15, 2026</p>
          </div>
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Timeline & Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Banner */}
            <div className="rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">Order is on the way!</p>
                  <p className="text-sm text-white/80 mt-1">Expected delivery: January 18-19, 2026</p>
                </div>
                <Badge className="bg-white/20 text-white border-0 px-4 py-1.5 text-sm">Shipped</Badge>
              </div>
              <Link href="/tracking/ORD-45689">
                <Button variant="secondary" size="sm" className="mt-4 gap-2 bg-white text-primary-700 hover:bg-gray-100">
                  <MapPin className="h-4 w-4" /> Track Live
                </Button>
              </Link>
            </div>

            {/* Order Timeline */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-6">Order Timeline</h3>
              <div className="space-y-0">
                {timeline.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = step.completed;
                  const isLast = index === timeline.length - 1;
                  return (
                    <div key={step.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          isCompleted ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`h-4 w-4 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 flex-1 ${isCompleted ? 'bg-green-200' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className={`pb-8 ${isLast ? 'pb-0' : ''}`}>
                        <p className={`text-sm font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                          {step.status}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{step.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Order Items ({orderItems.length})</h3>
              <div className="space-y-4">
                {orderItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-4"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                      <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">{formatPrice(item.price * item.qty)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Separator className="my-4" />
              <Link href="/orders/ORD-45689/invoice">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" /> Download Invoice
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-4">
            <PriceBreakdown subtotal={subtotal} shippingCharge={shipping} totalAmount={total} freeShippingThreshold={499} />

            <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Shipping Address</h4>
              <div className="text-xs text-gray-600 space-y-0.5">
                <p className="font-medium text-gray-900">Rajesh Kumar</p>
                <p>42, MG Road, Indiranagar</p>
                <p>Bangalore, Karnataka - 560038</p>
                <p>Phone: +91 9876543210</p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Need Help?</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <p>Contact our support team:</p>
                <p className="font-medium text-primary-600">support@naturekart.com</p>
                <p className="font-medium text-primary-600">+91 1800-123-4567</p>
              </div>
              <Separator className="my-3" />
              <Link href="/support">
                <Button variant="ghost" size="sm" className="w-full text-xs">Get Support</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
