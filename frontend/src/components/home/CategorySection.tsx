'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Category {
  name: string;
  slug: string;
  image: string;
  count: string;
  color: string;
  description: string;
}

const categories: Category[] = [
  {
    name: 'Natural Honey',
    slug: 'honey',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600&q=80',
    count: '25+ Products',
    color: 'from-amber-500 to-amber-600',
    description: 'Pure forest honey from tribal harvesters',
  },
  {
    name: 'Millets & Grains',
    slug: 'millets',
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&q=80',
    count: '45+ Products',
    color: 'from-yellow-600 to-yellow-700',
    description: 'Organic millets, rice & ancient grains',
  },
  {
    name: 'Cold Pressed Oils',
    slug: 'oils',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80',
    count: '30+ Products',
    color: 'from-green-600 to-green-700',
    description: 'Wood-pressed, chemical-free cooking oils',
  },
  {
    name: 'Natural Spices',
    slug: 'spices',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
    count: '40+ Products',
    color: 'from-red-500 to-red-600',
    description: 'Premium spices from hill regions',
  },
  {
    name: 'A2 Ghee & Dairy',
    slug: 'ghee',
    image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=600&q=80',
    count: '15+ Products',
    color: 'from-orange-500 to-orange-600',
    description: 'Bilona method A2 desi cow ghee',
  },
  {
    name: 'Pickles & Snacks',
    slug: 'pickles',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
    count: '35+ Products',
    color: 'from-rose-500 to-rose-600',
    description: 'Homemade pickles & traditional snacks',
  },
  {
    name: 'Herbal Tea & Powders',
    slug: 'herbal',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80',
    count: '25+ Products',
    color: 'from-teal-500 to-teal-600',
    description: 'Organic teas, herbal infusions & powders',
  },
  {
    name: 'Dry Fruits & Nuts',
    slug: 'dryfruits',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&q=80',
    count: '20+ Products',
    color: 'from-purple-500 to-purple-600',
    description: 'Premium quality dry fruits & nuts',
  },
  {
    name: 'Jaggery & Sweeteners',
    slug: 'jaggery',
    image: 'https://images.unsplash.com/photo-1587139223877-04cb899fa3e8?w=600&q=80',
    count: '12+ Products',
    color: 'from-amber-700 to-amber-800',
    description: 'Natural palm jaggery & raw honey',
  },
  {
    name: 'Traditional Rice',
    slug: 'rice',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
    count: '20+ Products',
    color: 'from-stone-600 to-stone-700',
    description: 'Organic traditional rice varieties',
  },
  {
    name: 'Coffee',
    slug: 'coffee',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    count: '15+ Products',
    color: 'from-stone-700 to-stone-800',
    description: 'Single-origin organic coffee beans',
  },
  {
    name: 'Herbal Products',
    slug: 'herbal-products',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80',
    count: '30+ Products',
    color: 'from-emerald-500 to-emerald-600',
    description: 'Ayurvedic herbs & natural wellness',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function CategorySection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -320 : 320;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1 w-6 rounded-full bg-primary-600" />
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Categories</span>
            </div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="mt-1.5 text-gray-500 max-w-xl">
              Explore our wide range of natural food categories, sourced directly from farms and tribal communities
            </p>
          </div>
          <Link href="/categories" className="hidden sm:block mt-4 sm:mt-0">
            <Button variant="outline" className="gap-2 border-primary-200 text-primary-700 hover:bg-primary-50 group">
              View All Categories
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Categories Grid with Scroll Arrows */}
        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={() => scrollCategories('left')}
            className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white shadow-xl border border-primary-100 p-2.5 text-primary-600 opacity-0 group-hover:opacity-100 hover:bg-primary-50 hover:scale-105 transition-all duration-300 hidden lg:flex"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scrollCategories('right')}
            className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white shadow-xl border border-primary-100 p-2.5 text-primary-600 opacity-0 group-hover:opacity-100 hover:bg-primary-50 hover:scale-105 transition-all duration-300 hidden lg:flex"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>          <motion.div
            ref={scrollRef}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          >
            {categories.map((cat) => (
              <motion.div key={cat.slug} variants={itemVariants} className="snap-start">
                <Link
                href={`/products?category=${cat.slug}`}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-2xl',
                  'transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl',
                  'bg-white border border-primary-100'
                )}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-sm font-bold text-white drop-shadow-sm">{cat.name}</h3>
                  </div>

                  {/* Hover info */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                    <Badge className={cn('bg-gradient-to-r text-white border-0 text-xs font-semibold px-3 py-1.5', cat.color)}>
                      {cat.count}
                    </Badge>
                  </div>
                </div>

                {/* Quick info bar */}
                <div className="px-3 py-2.5 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 truncate">{cat.description}</span>
                  <ArrowRight className="h-3 w-3 text-primary-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>        </div>{/* End scroll wrapper */}

          {/* Mobile View All */}
        <div className="mt-6 text-center sm:hidden">
          <Link href="/categories">
            <Button variant="outline" className="gap-2 border-primary-200 text-primary-700">
              View All Categories
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
