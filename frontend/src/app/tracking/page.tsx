'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Search, Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      setSearched(true);
    }
  };

  return (
    <div className="min-h-screen bg-natural">
      <div className="bg-white border-b border-primary-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <span className="text-primary-600 font-medium">Track Order</span>
          </div>
        </div>
      </div>

      <div className="container-custom py-12 md:py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-2xl bg-primary-50 flex items-center justify-center">
                <Package className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Track Your Order</h1>
            <p className="text-gray-500 mt-2">Enter your order number to check the status and delivery details</p>
          </div>

          <div className="bg-white rounded-2xl border border-primary-100 p-6 md:p-8 shadow-sm">
            <form onSubmit={handleSearch}>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Order Number</label>
              <div className="flex gap-3">
                <Input
                  placeholder="e.g. ORD-45689"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="flex-1 border-primary-200"
                />
                <Button type="submit" className="gap-2 gradient-primary text-white px-6">
                  <Search className="h-4 w-4" />
                  Track
                </Button>
              </div>
            </form>

            {searched && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-xl bg-primary-50 border border-primary-100">
                <div className="flex items-center gap-3 text-primary-800">
                  <Truck className="h-5 w-5" />
                  <div>
                    <p className="font-semibold text-sm">Order found! Click below to view details</p>
                    <Link href={`/tracking/${orderId}`} className="text-primary-600 text-xs hover:underline inline-flex items-center gap-1 mt-1">
                      View full tracking <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="mt-6 pt-4 border-t border-primary-100">
              <p className="text-xs text-gray-400">Need help? <Link href="/support" className="text-primary-600 hover:underline">Contact Support</Link></p>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">How Order Tracking Works</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { step: '1', title: 'Place Order', desc: 'Complete your purchase and receive an order number' },
                { step: '2', title: 'We Process', desc: 'We carefully pack your natural foods from our farm partners' },
                { step: '3', title: 'Track & Receive', desc: 'Follow your package in real-time until delivery' },
              ].map((item) => (
                <div key={item.step} className="text-center p-4 rounded-xl bg-white border border-primary-100">
                  <div className="h-8 w-8 rounded-full gradient-primary text-white text-sm font-bold flex items-center justify-center mx-auto mb-2">{item.step}</div>
                  <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
