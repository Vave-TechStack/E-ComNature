'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/home/ProductCard';
import type { Product } from '@/types';

interface RelatedProductsProps {
  title: string;
  products: Product[];
  viewAllHref?: string;
}

export function RelatedProducts({ title, products, viewAllHref }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        {viewAllHref && (
          <Link href={viewAllHref}>
            <Button variant="ghost" size="sm" className="gap-1 text-sm">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.slice(0, 5).map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <ProductCard product={product} variant="default" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
