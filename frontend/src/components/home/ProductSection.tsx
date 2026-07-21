'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  variant?: 'grid' | 'carousel';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

export function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref,
  variant = 'grid',
}: ProductSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (variant === 'carousel') {

    const scrollCarousel = (direction: 'left' | 'right') => {
      if (!scrollRef.current) return;
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    return (
      <section className="py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">{title}</h2>
              {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-2">
              {/* Scroll Arrows */}
              <div className="hidden sm:flex items-center gap-1.5 mr-2">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="rounded-full border border-primary-200 p-2 text-primary-500 hover:bg-primary-50 hover:border-primary-300 transition-all"
                  aria-label="Scroll products left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="rounded-full border border-primary-200 p-2 text-primary-500 hover:bg-primary-50 hover:border-primary-300 transition-all"
                  aria-label="Scroll products right"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              {viewAllHref && (
                <Link href={viewAllHref}>
                  <Button variant="outline" className="hidden sm:flex gap-2 border-primary-200 text-primary-700 hover:bg-primary-50 group">
                    View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="relative group">
            {/* Left Arrow overlay */}
            <button
              onClick={() => scrollCarousel('left')}
              className="absolute -left-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white shadow-xl border border-primary-100 p-2.5 text-primary-600 opacity-0 group-hover:opacity-100 hover:bg-primary-50 hover:scale-105 transition-all duration-300 hidden sm:flex"
              aria-label="Scroll products left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4"
            >
              {products.map((product) => (
                <div key={product.id} className="min-w-[260px] sm:min-w-[280px] snap-start h-full">
                  <ProductCard product={product} variant="default" />
                </div>
              ))}
            </div>
            {/* Right Arrow overlay */}
            <button
              onClick={() => scrollCarousel('right')}
              className="absolute -right-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white shadow-xl border border-primary-100 p-2.5 text-primary-600 opacity-0 group-hover:opacity-100 hover:bg-primary-50 hover:scale-105 transition-all duration-300 hidden sm:flex"
              aria-label="Scroll products right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">{title}</h2>
            {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
          </div>
          {viewAllHref && (
            <Link href={viewAllHref}>
              <Button variant="ghost" className="hidden sm:flex gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        {viewAllHref && (
          <div className="mt-8 text-center sm:hidden">
            <Link href={viewAllHref}>
              <Button variant="outline" className="gap-2">
                View All {title} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
