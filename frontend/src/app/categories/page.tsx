'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Sparkles, Tag, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const allCategories = [
  { name: 'Natural Honey', slug: 'honey', image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&q=80', count: '25+ Products', desc: 'Pure forest honey from tribal harvesters. Raw, unfiltered, and 100% natural.' },
  { name: 'Millets & Grains', slug: 'millets', image: 'https://images.pexels.com/photos/5486525/pexels-photo-5486525.jpeg?auto=compress&cs=tinysrgb&w=800', count: '45+ Products', desc: 'Organic millets, ancient grains, and traditional rice varieties.' },
  { name: 'Cold Pressed Oils', slug: 'oils', image: 'https://images.pexels.com/photos/4110003/pexels-photo-4110003.jpeg?auto=compress&cs=tinysrgb&w=800', count: '30+ Products', desc: 'Wood-pressed, chemical-free cooking oils using traditional ghani method.' },
  { name: 'Natural Spices', slug: 'spices', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80', count: '40+ Products', desc: 'Premium spices from hill regions of Meghalaya, Kerala and Western Ghats.' },
  { name: 'A2 Ghee & Dairy', slug: 'ghee', image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=800&q=80', count: '15+ Products', desc: 'Bilona method A2 desi cow ghee from indigenous Gir cows.' },
  { name: 'Pickles & Snacks', slug: 'pickles', image: 'https://images.pexels.com/photos/8477068/pexels-photo-8477068.jpeg?auto=compress&cs=tinysrgb&w=800', count: '35+ Products', desc: 'Homemade traditional pickles and healthy traditional snacks.' },
  { name: 'Herbal Tea', slug: 'herbal', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80', count: '25+ Products', desc: 'Organic teas, herbal infusions, and wellness powders.' },
  { name: 'Dry Fruits & Nuts', slug: 'dryfruits', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&q=80', count: '20+ Products', desc: 'Premium quality dry fruits and nuts sourced directly from farms.' },
  { name: 'Jaggery & Sweeteners', slug: 'jaggery', image: 'https://images.unsplash.com/photo-1587139223877-04cb899fa3e8?w=800&q=80', count: '12+ Products', desc: 'Natural palm jaggery, raw honey, and traditional sweeteners.' },
  { name: 'Traditional Rice', slug: 'rice', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80', count: '20+ Products', desc: 'Organic traditional rice varieties from different regions of India.' },
  { name: 'Coffee', slug: 'coffee', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', count: '15+ Products', desc: 'Single-origin organic coffee beans from hill plantations.' },
  { name: 'Herbal Products', slug: 'herbal-products', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', count: '30+ Products', desc: 'Ayurvedic herbs, natural wellness products, and traditional remedies.' },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-natural">
      <div className="bg-white border-b border-primary-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <span className="text-primary-600 font-medium">All Categories</span>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Leaf className="h-5 w-5 text-primary-600" />
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Browse</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">All Categories</h1>
            <p className="text-gray-500 mt-2">Explore our wide range of natural food categories, all sourced directly from farms and tribal communities</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {allCategories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/products?category=${cat.slug}`} className="group block rounded-2xl overflow-hidden bg-white border border-primary-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <Image src={cat.image} alt={cat.name} fill className="object-cover transition-all duration-500 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-bold text-white">{cat.name}</h3>
                      <span className="text-xs text-white/80">{cat.count}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{cat.desc}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary-600 group-hover:gap-2 transition-all">
                      Explore Products <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
