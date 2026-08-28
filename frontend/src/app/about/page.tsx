'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Leaf, Shield, HeartHandshake, Sprout, Users, Award, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';

const stats = [
  { icon: Users, value: '12,000+', label: 'Farmers Supported' },
  { icon: Sprout, value: '500+', label: 'Villages Reached' },
  { icon: HeartHandshake, value: '50,000+', label: 'Happy Customers' },
  { icon: Award, value: '100%', label: 'Chemical Free' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-primary-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link><span>/</span>
            <span className="text-primary-600 font-medium">About Us</span>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Hero */}
          <div className="relative rounded-3xl overflow-hidden h-64 md:h-96 mb-12">
            <Image src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80" alt="About NatureKart" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent flex items-end">
              <div className="p-8 md:p-12">
                <h1 className="text-3xl md:text-5xl font-heading text-white">Our Story</h1>
                <p className="text-white/70 mt-2 max-w-xl">Bringing pure, natural foods from India&apos;s farms and forests to your table</p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-heading text-noble-900 mb-4">Connecting You with Nature&apos;s Bounty</h2>
              <p className="text-noble-600 leading-relaxed mb-4">{APP_NAME} was born from a simple belief — that everyone deserves access to pure, chemical-free, and authentic natural foods. We work directly with tribal communities, organic farmers, and rural artisans across India to bring you the finest natural products.</p>
              <p className="text-noble-600 leading-relaxed mb-4">From the dense forests of Araku Valley where tribal communities harvest wild honey, to the hills of Meghalaya where Lakadong turmeric is grown, to the organic farms of Tamil Nadu producing traditional millets — every product has a story of dedication and purity.</p>
              <p className="text-noble-600 leading-relaxed">We are more than a marketplace. We are a movement towards sustainable, healthy, and ethical food choices that benefit both people and the planet.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-12">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="text-center p-6 rounded-2xl bg-white border border-primary-100">
                    <Icon className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold gradient-text">{s.value}</div>
                    <div className="text-xs text-noble-500 mt-1">{s.label}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Mission */}
            <div className="grid md:grid-cols-2 gap-6 my-12">
              {[
                { icon: Leaf, title: 'Our Mission', desc: 'To make pure, natural, and chemical-free foods accessible to every household while supporting rural communities and preserving traditional farming practices.' },
                { icon: Shield, title: 'Our Promise', desc: 'Every product is verified for authenticity and quality. We guarantee that what you receive is pure, natural, and sourced directly from trusted producers.' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="p-6 rounded-2xl bg-white border border-primary-100">
                    <Icon className="h-8 w-8 text-primary-600 mb-3" />
                    <h3 className="text-lg font-heading text-noble-900">{item.title}</h3>
                    <p className="text-sm text-noble-600 mt-2">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
