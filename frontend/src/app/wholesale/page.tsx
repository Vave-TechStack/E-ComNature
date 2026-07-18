'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, Phone, Mail, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function WholesalePage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-natural">
      <div className="bg-white border-b border-primary-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link><span>/</span>
            <span className="text-primary-600 font-medium">Wholesale Inquiry</span>
          </div>
        </div>
      </div>
      <div className="container-custom py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <Building2 className="h-10 w-10 text-primary-600 mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-gray-900">Wholesale & Bulk Orders</h1>
            <p className="text-gray-500 mt-2">Partner with us to bring natural foods to your customers</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              { icon: Building2, title: 'Bulk Pricing', desc: 'Special discounts for orders above ₹10,000' },
              { icon: Phone, title: 'Dedicated Support', desc: 'Personal account manager for all orders' },
              { icon: Mail, title: 'Custom Orders', desc: 'Tailored product selections for your business' },
              { icon: CheckCircle, title: 'Quality Guaranteed', desc: 'Same quality promise as retail products' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-3 p-4 rounded-xl bg-white border border-primary-100">
                  <Icon className="h-5 w-5 text-primary-600 shrink-0" />
                  <div><h3 className="font-semibold text-sm text-gray-900">{item.title}</h3><p className="text-xs text-gray-500 mt-0.5">{item.desc}</p></div>
                </div>
              );
            })}
          </div>
          <div className="bg-white rounded-2xl border border-primary-100 p-6 md:p-8">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900">Thank You!</h3>
                <p className="text-sm text-gray-500 mt-1">Our wholesale team will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Business Name *</label><Input placeholder="Your business name" className="border-primary-200" required /></div>
                  <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Contact Person *</label><Input placeholder="Your full name" className="border-primary-200" required /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Email *</label><Input type="email" placeholder="email@business.com" className="border-primary-200" required /></div>
                  <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Phone *</label><Input type="tel" placeholder="+91 98765 43210" className="border-primary-200" required /></div>
                </div>
                <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Approximate Monthly Order Value</label>
                  <select className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm">
                    <option>₹10,000 - ₹50,000</option>
                    <option>₹50,000 - ₹1,00,000</option>
                    <option>₹1,00,000 - ₹5,00,000</option>
                    <option>₹5,00,000+</option>
                  </select>
                </div>
                <Button type="submit" className="w-full gap-2 gradient-primary text-white font-semibold"><Send className="h-4 w-4" />Submit Inquiry</Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
