'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Truck, Package, Clock, MapPin, CheckCircle } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-natural">
      <div className="bg-white border-b border-primary-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link><span>/</span>
            <span className="text-primary-600 font-medium">Shipping Information</span>
          </div>
        </div>
      </div>
      <div className="container-custom py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <Truck className="h-10 w-10 text-primary-600 mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-gray-900">Shipping Information</h1>
            <p className="text-gray-500 mt-2">We deliver pure goodness to your doorstep</p>
          </div>
          <div className="space-y-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On all orders above ₹499. A shipping fee of ₹49 applies to orders below ₹499.' },
              { icon: Clock, title: 'Delivery Timeline', desc: 'Metro cities: 2-3 business days. Tier 2/3 cities: 3-5 business days. Remote areas: 5-7 business days.' },
              { icon: Package, title: 'Packaging', desc: 'All products are carefully packed in eco-friendly, food-grade packaging to maintain freshness.' },
              { icon: MapPin, title: 'Serviceable Areas', desc: 'We currently deliver to all pin codes across India. Enter your pincode at checkout to check availability.' },
              { icon: CheckCircle, title: 'Order Tracking', desc: 'Track your order in real-time using our tracking system. You will receive updates via email and SMS.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4 p-5 rounded-xl bg-white border border-primary-100">
                  <Icon className="h-6 w-6 text-primary-600 shrink-0 mt-0.5" />
                  <div><h3 className="font-semibold text-gray-900">{item.title}</h3><p className="text-sm text-gray-600 mt-1">{item.desc}</p></div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
