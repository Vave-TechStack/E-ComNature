'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  gradient: string;
}

const categories: Category[] = [
  {
    name: 'Natural Honey',
    slug: 'honey',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600&q=80',
    count: '25+ Products',
    color: 'from-amber-500 to-amber-600',
    description: 'Pure forest honey from tribal harvesters',
    gradient: 'from-amber-900/80 via-amber-800/50 to-transparent',
  },
  {
    name: 'Millets & Grains',
    slug: 'millets',
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&q=80',
    count: '45+ Products',
    color: 'from-yellow-600 to-yellow-700',
    description: 'Organic millets, rice & ancient grains',
    gradient: 'from-yellow-900/80 via-yellow-800/50 to-transparent',
  },
  {
    name: 'Cold Pressed Oils',
    slug: 'oils',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80',
    count: '30+ Products',
    color: 'from-emerald-600 to-emerald-700',
    description: 'Wood-pressed, chemical-free cooking oils',
    gradient: 'from-emerald-900/80 via-emerald-800/50 to-transparent',
  },
  {
    name: 'Natural Spices',
    slug: 'spices',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
    count: '40+ Products',
    color: 'from-red-500 to-red-600',
    description: 'Premium spices from hill regions',
    gradient: 'from-red-900/80 via-red-800/50 to-transparent',
  },
  {
    name: 'A2 Ghee & Dairy',
    slug: 'ghee',
    image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=600&q=80',
    count: '15+ Products',
    color: 'from-orange-500 to-orange-600',
    description: 'Bilona method A2 desi cow ghee',
    gradient: 'from-orange-900/80 via-orange-800/50 to-transparent',
  },
  {
    name: 'Pickles & Snacks',
    slug: 'pickles',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
    count: '35+ Products',
    color: 'from-rose-500 to-rose-600',
    description: 'Homemade pickles & traditional snacks',
    gradient: 'from-rose-900/80 via-rose-800/50 to-transparent',
  },
  {
    name: 'Herbal Tea & Powders',
    slug: 'herbal',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80',
    count: '25+ Products',
    color: 'from-teal-500 to-teal-600',
    description: 'Organic teas, herbal infusions & powders',
    gradient: 'from-teal-900/80 via-teal-800/50 to-transparent',
  },
  {
    name: 'Jaggery & Sweeteners',
    slug: 'jaggery',
    image: 'https://images.unsplash.com/photo-1587139223877-04cb899fa3e8?w=600&q=80',
    count: '12+ Products',
    color: 'from-amber-700 to-amber-800',
    description: 'Natural palm jaggery & raw honey',
    gradient: 'from-amber-900/80 via-amber-800/50 to-transparent',
  },
];

function CategoryCard({ category, index }: { category: Category; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const imageY = useTransform(scrollYProgress, [0, 0.5], [0, -20]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link
        href={`/products?category=${category.slug}`}
        className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-noble-800 border border-noble-200 dark:border-noble-700 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary-500/10 h-full"
      >
        {/* Image with Parallax */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-[5px]">
          <motion.div style={{ scale: imageScale, y: imageY }} className="absolute inset-0">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              loading={index < 4 ? 'eager' : 'lazy'}
            />
          </motion.div>
          <div className={cn('absolute inset-0 bg-gradient-to-t', category.gradient)} />

          {/* Category name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className="text-lg font-bold text-white drop-shadow-sm">{category.name}</h3>
          </div>

          {/* Hover overlay info */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 bg-black/30 backdrop-blur-[2px] z-10">
            <div className="flex flex-col items-center gap-3">
              <Badge className={cn('bg-gradient-to-r text-white border-0 text-sm font-bold px-4 py-2 shadow-xl', category.color)}>
                {category.count}
              </Badge>
              <span className="text-white/80 text-xs flex items-center gap-1">
                Browse Collection
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Info bar */}
        <div className="px-4 py-3 flex items-center justify-between bg-white dark:bg-noble-800 mt-auto">
          <span className="text-xs text-noble-400 truncate">{category.description}</span>
          <ArrowRight className="h-3.5 w-3.5 text-primary-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shrink-0" />
        </div>

        {/* Accent line on hover */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </Link>
    </motion.div>
  );
}

export function CategorySection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -360 : 360;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="section-padding bg-white dark:bg-noble-900">
      <div className="container-luxury">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 md:mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="divider-accent" />
              <span className="text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-[0.15em]">Categories</span>
            </div>
            <h2 className="heading-md text-noble-800 dark:text-noble-100">Shop by Category</h2>
            <p className="mt-2 text-noble-400 max-w-xl text-sm">
              Explore our wide range of natural food categories, sourced directly from farms and tribal communities
            </p>
          </div>
          <Link href="/categories" className="hidden sm:block mt-4 sm:mt-0">
            <Button variant="outline" className="gap-2 border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 group rounded-xl">
              View All Categories
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Categories with Scroll Control */}
        <div className="relative group/scroll">
          {/* Left Arrow */}
          <button
            onClick={() => scrollCategories('left')}
            className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 rounded-full glass-strong p-2.5 text-primary-600 opacity-0 group-hover/scroll:opacity-100 hover:bg-white hover:scale-105 transition-all duration-300 hidden lg:flex shadow-xl border border-primary-100/50"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scrollCategories('right')}
            className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 rounded-full glass-strong p-2.5 text-primary-600 opacity-0 group-hover/scroll:opacity-100 hover:bg-white hover:scale-105 transition-all duration-300 hidden lg:flex shadow-xl border border-primary-100/50"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div
            ref={scrollRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
          >
            {categories.map((cat, index) => (
              <div key={cat.slug} className="snap-start h-full">
                <CategoryCard category={cat} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/categories">
            <Button variant="outline" className="gap-2 border-primary-200 text-primary-600 rounded-xl">
              View All Categories
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
