'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/home/ProductCard';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface RelatedProductsProps {
  title: string;
  products: Product[];
  viewAllHref?: string;
  showScrollButtons?: boolean;
}

export function RelatedProducts({
  title,
  products,
  viewAllHref,
  showScrollButtons = true,
}: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [scrollStartX, setScrollStartX] = useState(0);

  if (!products || products.length === 0) return null;

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, products]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.6;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setScrollStartX(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const diff = e.clientX - dragStartX;
    scrollRef.current.scrollLeft = scrollStartX - diff;
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary-500" />
          <h3 className="text-xl font-bold text-noble-800">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Scroll buttons */}
          {showScrollButtons && (
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={cn(
                  'w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200',
                  canScrollLeft
                    ? 'border-noble-200 text-noble-600 hover:bg-noble-50 hover:border-noble-300'
                    : 'border-noble-100 text-noble-200 cursor-not-allowed'
                )}
                aria-label="Scroll related products left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={cn(
                  'w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200',
                  canScrollRight
                    ? 'border-noble-200 text-noble-600 hover:bg-noble-50 hover:border-noble-300'
                    : 'border-noble-100 text-noble-200 cursor-not-allowed'
                )}
                aria-label="Scroll related products right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
          {viewAllHref && (
            <Link href={viewAllHref}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Horizontal scrollable product grid */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide -mx-1 px-1"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="flex gap-4 pb-2" style={{ minWidth: 'max-content' }}>
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="w-[200px] sm:w-[220px] md:w-[240px] shrink-0"
              style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
            >
              <ProductCard product={product} variant="default" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll progress indicator */}
      <ScrollProgress scrollRef={scrollRef} />
    </section>
  );
}

function ScrollProgress({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateProgress = () => {
      const scrollable = el.scrollWidth - el.clientWidth;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      setProgress((el.scrollLeft / scrollable) * 100);
    };

    updateProgress();
    el.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      el.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [scrollRef]);

  return (
    <div className="mt-4 h-1 rounded-full bg-noble-100 overflow-hidden max-w-[200px] mx-auto">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  );
}
