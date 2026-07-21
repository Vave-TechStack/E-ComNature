'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Droplets, Wheat, Flame, Leaf, Coffee, Citrus,
  Flower2, TreePine, ArrowRight, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories = [
  { name: 'Natural Honey', slug: 'honey', icon: Droplets, gradient: 'from-amber-500 to-amber-600', bgLight: 'bg-amber-50 dark:bg-amber-950/20', count: '25+' },
  { name: 'Millets & Grains', slug: 'millets', icon: Wheat, gradient: 'from-yellow-600 to-yellow-700', bgLight: 'bg-yellow-50 dark:bg-yellow-950/20', count: '45+' },
  { name: 'Cold Pressed Oils', slug: 'oils', icon: Droplets, gradient: 'from-emerald-600 to-emerald-700', bgLight: 'bg-emerald-50 dark:bg-emerald-950/20', count: '30+' },
  { name: 'Natural Spices', slug: 'spices', icon: Flame, gradient: 'from-red-500 to-red-600', bgLight: 'bg-red-50 dark:bg-red-950/20', count: '40+' },
  { name: 'Herbal Tea & Powders', slug: 'herbal', icon: Leaf, gradient: 'from-teal-500 to-teal-600', bgLight: 'bg-teal-50 dark:bg-teal-950/20', count: '35+' },
  { name: 'A2 Ghee & Dairy', slug: 'ghee', icon: Coffee, gradient: 'from-orange-500 to-orange-600', bgLight: 'bg-orange-50 dark:bg-orange-950/20', count: '15+' },
  { name: 'Dry Fruits & Nuts', slug: 'dryfruits', icon: Citrus, gradient: 'from-purple-500 to-purple-600', bgLight: 'bg-purple-50 dark:bg-purple-950/20', count: '20+' },
  { name: 'Tribal Products', slug: 'tribal', icon: Flower2, gradient: 'from-pink-500 to-pink-600', bgLight: 'bg-pink-50 dark:bg-pink-950/20', count: '50+' },
];

export function FeaturedCategories() {
  return (
    <section className="section-padding bg-noble-50 dark:bg-noble-900 overflow-hidden">
      <div className="container-luxury">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="divider-accent" />
              <span className="text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-[0.15em]">Categories</span>
            </div>
            <h2 className="heading-md text-noble-800 dark:text-noble-100">Shop by Category</h2>
          </div>
          <Link href="/categories">
            <Button variant="ghost" className="hidden sm:flex gap-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-xl">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Icons Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4"
        >
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <Link
                  href={`/products?category=${cat.slug}`}
                  className={cn(
                    'flex flex-col items-center gap-3 rounded-2xl p-5 sm:p-6 h-full',
                    'transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl',
                    cat.bgLight,
                    'group border border-transparent hover:border-white/50 dark:hover:border-white/10'
                  )}
                >
                  <div className={cn(
                    'flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl',
                    'bg-gradient-to-br text-white shadow-lg',
                    cat.gradient,
                    'transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl'
                  )}>
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm font-semibold text-noble-700 dark:text-noble-300 group-hover:text-noble-900 dark:group-hover:text-white transition-colors">
                      {cat.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-noble-400 dark:text-noble-500 mt-0.5 flex items-center justify-center gap-1">
                      <Sparkles className="h-3 w-3 text-primary-400" />
                      {cat.count} items
                    </p>
                  </div>

                  {/* Accent line top */}
                  <div className={cn(
                    'absolute top-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                    cat.gradient
                  )} />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
