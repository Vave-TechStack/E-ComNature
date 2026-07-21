'use client';

import { useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Sparkles, ArrowLeft, SearchX, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/home/ProductCard';
import { ProductFilters } from '@/components/product/ProductFilters';
import { ProductToolbar, type ViewMode } from '@/components/product/ProductToolbar';
import { ProductPagination } from '@/components/product/ProductPagination';
import { useProducts } from '@/services/products';
import { PAGINATION } from '@/lib/constants';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';
import type { ProductFilter } from '@/types';

const categoryMeta: Record<string, { name: string; desc: string; icon: typeof Leaf; color: string }> = {
  honey: { name: 'Natural Honey', desc: 'Pure forest honey sourced from tribal harvesters in Araku Valley', icon: Sparkles, color: 'text-amber-500' },
  millets: { name: 'Millets & Grains', desc: 'Organic millets, ancient grains, and traditional rice varieties', icon: Leaf, color: 'text-yellow-600' },
  oils: { name: 'Cold Pressed Oils', desc: 'Wood-pressed oils using traditional ghani method, chemical-free', icon: Leaf, color: 'text-green-600' },
  spices: { name: 'Natural Spices', desc: 'Premium spices from the hill regions of India', icon: Sparkles, color: 'text-red-500' },
  ghee: { name: 'A2 Ghee & Dairy', desc: 'Bilona method A2 ghee from indigenous Gir cows', icon: Leaf, color: 'text-orange-500' },
  pickles: { name: 'Pickles & Snacks', desc: 'Homemade traditional pickles without preservatives', icon: Leaf, color: 'text-rose-500' },
  herbal: { name: 'Herbal Tea & Powders', desc: 'Organic teas, herbal infusions, and wellness powders', icon: Sparkles, color: 'text-teal-500' },
  dryfruits: { name: 'Dry Fruits & Nuts', desc: 'Premium quality dry fruits sourced directly from farms', icon: Leaf, color: 'text-emerald-600' },
  jaggery: { name: 'Jaggery & Sweeteners', desc: 'Natural palm jaggery, raw honey, and traditional sweeteners', icon: Leaf, color: 'text-amber-600' },
  rice: { name: 'Traditional Rice', desc: 'Organic traditional rice varieties from different regions', icon: Leaf, color: 'text-yellow-500' },
  coffee: { name: 'Coffee', desc: 'Single-origin organic coffee beans from hill plantations', icon: Sparkles, color: 'text-amber-700' },
  organic: { name: 'Organic Collection', desc: 'Certified organic products grown without chemicals', icon: Leaf, color: 'text-emerald-500' },
};

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || PAGINATION.DEFAULT_PAGE;
  const sortBy = searchParams.get('sortBy') || 'popularity';
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filters: ProductFilter = {
    page: currentPage,
    size: PAGINATION.DEFAULT_SIZE,
    sortBy,
    category,
    search,
    brand: searchParams.get('brand')?.split(',').filter(Boolean),
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
    inStock: searchParams.get('inStock') === 'true' ? true : undefined,
    onSale: searchParams.get('onSale') === 'true' ? true : undefined,
  };

  const { data, isLoading, isError } = useProducts(filters);
  const catMeta = category ? categoryMeta[category] : null;

  const updateFilters = useCallback((newFilters: Partial<ProductFilter>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || 
          (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    params.set('page', '1');
    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', sort);
    params.set('page', '1');
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/products?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    router.push('/products', { scroll: false });
  };

  return (
    <div className="min-h-screen bg-natural">
      {/* ===== PREMIUM HEADER ===== */}
      <div className="relative overflow-hidden border-b border-noble-200 bg-white">
        {/* Decorative gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-gradient-to-b from-primary-50/50 to-transparent pointer-events-none" />

        <div className="relative container-custom py-6">
          <div className="flex items-center gap-3 mb-2">
            {category && (
              <Link href="/products">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-noble-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            )}
            <div className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br',
              catMeta ? 'from-primary-100 to-primary-50' : 'from-primary-50 to-primary-100'
            )}>
              <Leaf className={cn('h-5 w-5', catMeta?.color || 'text-primary-600')} />
            </div>
            <span className="text-xs font-bold text-noble-500 uppercase tracking-widest">
              {catMeta ? catMeta.name : search ? `Search: ${search}` : 'All Products'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-noble-900 heading-md">
            {catMeta?.name || (search ? `Results for "${search}"` : 'All Natural Products')}
          </h1>

          <p className="mt-1.5 text-sm text-noble-400 max-w-2xl">
            {catMeta?.desc || (search
              ? `Showing products matching "${search}"`
              : 'Browse our complete collection of premium natural foods, sourced directly from farms and tribal communities'
            )}
          </p>

          {category && catMeta && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge className="bg-primary-50 text-primary-700 border border-primary-200 text-xs font-medium rounded-full px-3 py-1">
                <catMeta.icon className={cn('h-3 w-3 mr-1.5', catMeta.color)} />
                {catMeta.name}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="flex gap-8">
          {/* ===== SIDEBAR FILTERS ===== */}
          <div className="hidden lg:block w-72 shrink-0">
            <ProductFilters
              filters={{
                category: filters.category,
                brand: filters.brand,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                rating: filters.rating,
                inStock: filters.inStock,
                onSale: filters.onSale,
              }}
              onFilterChange={updateFilters}
              onClear={clearAllFilters}
            />
          </div>

          {/* ===== MAIN CONTENT ===== */}
          <div className="flex-1 min-w-0">
            <ProductToolbar
              totalProducts={data?.totalElements || 0}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              currentPage={currentPage}
              pageSize={PAGINATION.DEFAULT_SIZE}
            />

            {/* Loading State */}
            {isLoading && (
              <div className="mt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="space-y-3"
                    >
                      <Skeleton className="aspect-square rounded-2xl bg-noble-100" />
                      <Skeleton className="h-4 w-3/4 bg-noble-100 rounded-lg" />
                      <Skeleton className="h-4 w-1/2 bg-noble-100 rounded-lg" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-16"
              >
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 border-2 border-red-100 mb-4">
                    <AlertCircle className="h-10 w-10 text-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-noble-800 mb-2">Failed to load products</h3>
                  <p className="text-sm text-noble-400 text-center max-w-sm mb-6">
                    We couldn&apos;t fetch the product list. Please check your connection and try again.
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="gap-2 gradient-primary text-white shadow-lg shadow-primary-200/50 rounded-xl"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh Page
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && data?.content.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-16"
              >
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 border-2 border-amber-100 mb-4">
                    <SearchX className="h-10 w-10 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold text-noble-800 mb-2">No products found</h3>
                  <p className="text-sm text-noble-400 text-center max-w-sm mb-6">
                    Try adjusting your filters or search terms. We have a wide range of natural products waiting for you.
                  </p>
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    className="gap-2 border-noble-200 text-noble-600 hover:border-primary-200 hover:text-primary-600 rounded-xl"
                  >
                    <Leaf className="h-4 w-4" />
                    Clear All Filters
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Products Grid */}
            {!isLoading && !isError && data && data.content.length > 0 && (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewMode + JSON.stringify(filters)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      'mt-6 gap-4 sm:gap-6',
                      viewMode === 'grid'
                        ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
                        : 'space-y-4'
                    )}
                  >
                    {data.content.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        variant={viewMode === 'list' ? 'horizontal' : 'default'}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                <div className="mt-10">
                  <ProductPagination
                    currentPage={currentPage}
                    totalPages={data.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-natural">
        <div className="container-custom py-6">
          <Skeleton className="h-10 w-48 bg-noble-100 rounded-xl mb-4" />
          <Skeleton className="h-6 w-96 bg-noble-100 rounded-lg mb-8" />
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="space-y-3"
              >
                <Skeleton className="aspect-square rounded-2xl bg-noble-100" />
                <Skeleton className="h-4 w-3/4 bg-noble-100 rounded-lg" />
                <Skeleton className="h-4 w-1/2 bg-noble-100 rounded-lg" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
