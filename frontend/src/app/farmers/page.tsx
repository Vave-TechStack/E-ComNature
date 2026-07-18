'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Leaf, MapPin, Quote, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const farmers = [
  { name: 'Lakshmi Devi', age: '45', location: 'Araku Valley, AP', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', story: 'Leads a cooperative of 200+ tribal women harvesting wild forest honey.', product: 'Forest Honey', badge: 'Tribal Women Cooperative' },
  { name: 'Raju Naik', age: '52', location: 'Dindigul, TN', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80', story: 'Organic millet farmer mentoring 50+ farmers in chemical-free cultivation.', product: 'Organic Millets', badge: 'Organic Farmer' },
  { name: 'Meena Devi', age: '38', location: 'Chittoor, AP', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80', story: 'Produces cold-pressed oils using traditional wooden ghani method.', product: 'Cold Pressed Oils', badge: 'Women Entrepreneur' },
  { name: 'Gopal Rao', age: '60', location: 'Meghalaya', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80', story: 'Grows premium Lakadong turmeric with 7-12% curcumin content.', product: 'Lakadong Turmeric', badge: 'Premium Grower' },
];

export default function FarmersPage() {
  return (
    <div className="min-h-screen bg-natural">
      <div className="bg-white border-b border-primary-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link><span>/</span>
            <span className="text-primary-600 font-medium">Our Farmers</span>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Leaf className="h-8 w-8 text-primary-600 mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Meet Our Farmers</h1>
            <p className="text-gray-500 mt-3">The real heroes behind every product — dedicated farmers and tribal harvesters who grow pure, natural food with love</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {farmers.map((farmer, i) => (
              <motion.div key={farmer.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-primary-100 overflow-hidden hover:shadow-xl transition-all group">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-44 h-44 sm:h-auto shrink-0">
                    <Image src={farmer.image} alt={farmer.name} fill className="object-cover" sizes="176px" />
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/30 to-transparent" />
                  </div>
                  <div className="p-5 flex-1">
                    <Badge className="bg-primary-50 text-primary-700 border-primary-200 text-xs mb-2">{farmer.badge}</Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-1"><MapPin className="h-3 w-3" />{farmer.location}</div>
                    <h3 className="text-lg font-bold text-gray-900">{farmer.name}</h3>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{farmer.story}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-primary-600">Known for: <span className="font-semibold">{farmer.product}</span></span>
                      <Heart className="h-4 w-4 text-red-400 hover:text-red-500 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-3xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold">Support Our Farmers</h2>
            <p className="text-white/70 mt-2 max-w-xl mx-auto">Every purchase directly supports these farmers and their communities</p>
            <Link href="/products"><Button className="mt-6 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-8">Shop Now & Support</Button></Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
