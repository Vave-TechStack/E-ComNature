'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PressPage() {
  return (
    <div className="min-h-screen bg-natural">
      <div className="bg-white border-b border-primary-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link><span>/</span>
            <span className="text-primary-600 font-medium">Press & Media</span>
          </div>
        </div>
      </div>
      <div className="container-custom py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <Newspaper className="h-10 w-10 text-primary-600 mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-gray-900">Press & Media</h1>
            <p className="text-gray-500 mt-2">Latest news, announcements, and media coverage</p>
          </div>
          <div className="space-y-4">
            {[
              { title: 'NatureKart Raises ₹2 Cr to Expand Tribal Sourcing Network', date: 'March 2026', source: 'Financial Express' },
              { title: 'How NatureKart is Empowering Tribal Women Through Honey Harvesting', date: 'February 2026', source: 'The Better India' },
              { title: 'India\'s Organic Food Market Gets a Boost with NatureKart\'s Direct Farm Model', date: 'January 2026', source: 'Economic Times' },
              { title: 'NatureKart Partners with 500+ Farmers Across 10 States', date: 'December 2025', source: 'YourStory' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="p-5 rounded-xl bg-white border border-primary-100 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{item.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{item.date}</span>
                      <span>{item.source}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary-400 shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 p-6 rounded-xl bg-primary-50 border border-primary-100">
            <p className="text-sm text-primary-800">For media inquiries: <span className="font-semibold">press@naturekart.in</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
