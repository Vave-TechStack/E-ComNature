'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  { q: 'What makes your products different?', a: 'All our products are sourced directly from farms, tribal communities, and hill regions. They are 100% natural, chemical-free, and authentically sourced without middlemen.' },
  { q: 'Are your products certified organic?', a: 'Many of our products are certified organic. We clearly label organic certifications on product pages. Even non-certified products are grown using traditional, chemical-free methods.' },
  { q: 'How do you ensure product quality?', a: 'We have a rigorous quality check process. Every batch is tested for purity and authenticity. We work directly with producers and visit farms regularly.' },
  { q: 'What is your return policy?', a: 'We offer a 10-day easy return policy. If you are not satisfied with any product, contact our support team for a full refund or replacement.' },
  { q: 'How long does delivery take?', a: 'Metro cities: 2-3 days. Tier 2/3 cities: 3-5 days. Remote areas: 5-7 days. Free shipping on orders above ₹499.' },
  { q: 'Do you ship internationally?', a: 'Currently we ship only within India. We are working on expanding to international shipping soon.' },
  { q: 'How can I track my order?', a: 'Use our order tracking page with your order number. You will also receive regular updates via email and SMS.' },
  { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 24 hours of placing. Once shipped, please refer to our return policy.' },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-natural">
      <div className="bg-white border-b border-primary-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link><span>/</span>
            <span className="text-primary-600 font-medium">FAQs</span>
          </div>
        </div>
      </div>
      <div className="container-custom py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <HelpCircle className="h-10 w-10 text-primary-600 mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
            <p className="text-gray-500 mt-2">Everything you need to know about our products and services</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-primary-100 overflow-hidden">
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-4 md:p-5 text-left">
                  <span className="text-sm md:text-base font-medium text-gray-900 pr-4">{faq.q}</span>
                  <ChevronDown className={cn('h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200', openIndex === i && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="px-4 md:px-5 pb-4 md:pb-5 text-sm text-gray-600 leading-relaxed border-t border-primary-100 pt-3">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
