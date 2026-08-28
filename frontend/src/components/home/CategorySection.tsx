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
    color: 'from-amber-600 to-amber-700',
    description: 'Pure forest honey from tribal harvesters',
    gradient: 'from-amber-900/80 via-amber-800/50 to-transparent',
  },
  {
    name: 'Millets & Grains',
    slug: 'millets',
    image: 'https://images.pexels.com/photos/5486525/pexels-photo-5486525.jpeg?auto=compress&cs=tinysrgb&w=600',
    count: '45+ Products',
    color: 'from-yellow-700 to-yellow-800',
    description: 'Organic millets, rice & ancient grains',
    gradient: 'from-yellow-900/80 via-yellow-800/50 to-transparent',
  },
  {
    name: 'Cold Pressed Oils',
    slug: 'oils',
    image: 'https://images.pexels.com/photos/4110003/pexels-photo-4110003.jpeg?auto=compress&cs=tinysrgb&w=600',
    count: '30+ Products',
    color: 'from-primary-600 to-primary-700',
    description: 'Wood-pressed, chemical-free cooking oils',
    gradient: 'from-primary-900/80 via-primary-800/50 to-transparent',
  },
  {
    name: 'Natural Spices',
    slug: 'spices',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
    count: '40+ Products',
    color: 'from-red-600 to-red-700',
    description: 'Premium spices from hill regions',
    gradient: 'from-red-900/80 via-red-800/50 to-transparent',
  },
  {
    name: 'A2 Ghee & Dairy',
    slug: 'ghee',
    image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=600&q=80',
    count: '15+ Products',
    color: 'from-orange-600 to-orange-700',
    description: 'Bilona method A2 desi cow ghee',
    gradient: 'from-orange-900/80 via-orange-800/50 to-transparent',
  },
  {
    name: 'Pickles & Snacks',
    slug: 'pickles',
    image: 'https://images.pexels.com/photos/8477068/pexels-photo-8477068.jpeg?auto=compress&cs=tinysrgb&w=600',
    count: '35+ Products',
    color: 'from-rose-600 to-rose-700',
    description: 'Homemade pickles & traditional snacks',
    gradient: 'from-rose-900/80 via-rose-800/50 to-transparent',
  },
  {
    name: 'Herbal Tea & Powders',
    slug: 'herbal',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80',
    count: '25+ Products',
    color: 'from-emerald-600 to-emerald-700',
    description: 'Organic teas, herbal infusions & powders',
    gradient: 'from-emerald-900/80 via-emerald-800/50 to-transparent',
  },
  {
    name: 'Jaggery & Sweeteners',
    slug: 'jaggery',
    image: 'https://images.unsplash.com/photo-1587139223877-04cb899fa3e8?w=600&q=80',
    count: '20+ Products',
    color: 'from-amber-700 to-amber-800',
    description: 'Natural palm jaggery & traditional sweeteners',
    gradient: 'from-amber-900/80 via-amber-800/50 to-transparent',
  },
];

export function CategorySection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10 md:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1 w-6 rounded-full bg-primary-500" />
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-[0.15em]">Browse by Category</span>
            </div>
            <h2 className="section-title">Our Natural Collection</h2>
            <p className="mt-2 text-noble-400 max-w-lg text-sm">
              Explore our curated range of pure, natural products sourced directly from farms and forests across India.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scrollCarousel('left')}
              className="rounded-full border border-noble-200 p-2.5 text-noble-500 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="rounded-full border border-noble-200 p-2.5 text-noble-500 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Category Grid — Horizontal Scroll */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4"
          >
            {categories.map((category, i) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="min-w-[240px] sm:min-w-[280px] snap-start"
              >
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group block relative rounded-2xl overflow-hidden h-64 sm:h-72 border border-noble-100 hover:border-primary-200 transition-all duration-500 hover:shadow-xl"
                >
                  {/* Background Image */}
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className={cn('absolute inset-0 bg-gradient-to-t', category.gradient)} />

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-5 z-10">
                    <Badge className="bg-white/15 backdrop-blur-sm text-white border-white/20 text-[10px] font-semibold px-2.5 py-0.5 mb-2">
                      {category.count}
                    </Badge>
                    <h3 className="text-lg font-heading text-white mb-1">{category.name}</h3>
                    <p className="text-xs text-white/60 mb-3">{category.description}</p>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-white/70 group-hover:text-white transition-colors">
                      Explore Collection
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile View All */}
        <div className="mt-6 text-center sm:hidden">
          <Link href="/categories">
            <Button variant="outline" className="gap-2 border-noble-200 text-noble-600">
              View All Categories
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
