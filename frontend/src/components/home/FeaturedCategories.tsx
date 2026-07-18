'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Droplets, Wheat, Flame, Leaf, Coffee, Citrus,
  Flower2, TreePine, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories = [
  { name: 'Natural Honey', slug: 'honey', icon: Droplets, color: 'from-amber-500 to-amber-600', bgColor: 'bg-amber-50', count: '25+' },
  { name: 'Millets & Grains', slug: 'millets', icon: Wheat, color: 'from-yellow-600 to-yellow-700', bgColor: 'bg-yellow-50', count: '45+' },
  { name: 'Cold Pressed Oils', slug: 'oils', icon: Droplets, color: 'from-green-600 to-green-700', bgColor: 'bg-green-50', count: '30+' },
  { name: 'Natural Spices', slug: 'spices', icon: Flame, color: 'from-red-500 to-red-600', bgColor: 'bg-red-50', count: '40+' },
  { name: 'Herbal Tea & Powders', slug: 'herbal', icon: Leaf, color: 'from-teal-500 to-teal-600', bgColor: 'bg-teal-50', count: '35+' },
  { name: 'A2 Ghee & Dairy', slug: 'ghee', icon: Coffee, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', count: '15+' },
  { name: 'Dry Fruits & Nuts', slug: 'dryfruits', icon: Citrus, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', count: '20+' },
  { name: 'Tribal Products', slug: 'tribal', icon: Flower2, color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-50', count: '50+' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export function FeaturedCategories() {
  return (
    <section className="py-12">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="mt-1 text-gray-500">Explore our wide range of product categories</p>
          </div>
          <Link href="/categories">
            <Button variant="ghost" className="hidden sm:flex gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div key={cat.slug} variants={itemVariants}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className={cn(
                    'flex flex-col items-center gap-3 rounded-xl p-4 sm:p-6',
                    'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
                    cat.bgColor,
                    'group'
                  )}
                >
                  <div className={cn(
                    'flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl',
                    'bg-gradient-to-br text-white shadow-sm',
                    cat.color,
                    'transition-transform duration-300 group-hover:scale-110'
                  )}>
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm font-semibold text-gray-800">{cat.name}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{cat.count} items</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
