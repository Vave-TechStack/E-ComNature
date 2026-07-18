'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Phone, Mail, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function BulkPage() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div className="min-h-screen bg-natural">
      <div className="bg-white border-b border-primary-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link><span>/</span>
            <span className="text-primary-600 font-medium">Bulk Orders</span>
          </div>
        </div>
      </div>
      <div className="container-custom py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <Package className="h-10 w-10 text-primary-600 mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-gray-900">Bulk Orders</h1>
            <p className="text-gray-500 mt-2">Get special pricing for bulk purchases of natural foods</p>
          </div>
          <div className="bg-white rounded-2xl border border-primary-100 p-6 md:p-8">
            {submitted ? (
              <div className="text-center py-8"><CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" /><h3 className="text-lg font-bold text-gray-900">Thank You!</h3><p className="text-sm text-gray-500 mt-1">Our team will contact you within 24 hours.</p></div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Full Name *</label><Input placeholder="Your name" className="border-primary-200" required /></div>
                  <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Organization *</label><Input placeholder="Company/Organization name" className="border-primary-200" required /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Email *</label><Input type="email" placeholder="email@organization.com" className="border-primary-200" required /></div>
                  <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Phone *</label><Input type="tel" placeholder="+91 98765 43210" className="border-primary-200" required /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Quantity Required</label>
                    <select className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm">
                      <option>10 - 50 units</option><option>50 - 100 units</option><option>100 - 500 units</option><option>500+ units</option>
                    </select>
                  </div>
                  <div><label className="text-xs font-semibold text-gray-700 mb-1 block">Preferred Products</label>
                    <select className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm">
                      <option>Honey & Sweeteners</option><option>Millets & Grains</option><option>Cold Pressed Oils</option><option>Mixed Products</option>
                    </select>
                  </div>
                </div>
                <Button type="submit" className="w-full gap-2 gradient-primary text-white font-semibold"><Send className="h-4 w-4" />Submit Inquiry</Button>
              </form>
            )}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-primary-500" />+91 1800-123-8900</span>
            <span className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-primary-500" />bulk@naturekart.in</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
