'use client';

import { useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Sparkles, ArrowLeft, AlertCircle } from 'lucide-react';
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

const categoryMeta: Record<string, { name: string; desc: string; icon: typeof Leaf }> = {
  honey: { name: 'Natural Honey', desc: 'Pure forest honey sourced from tribal harvesters in Araku Valley', icon: Sparkles },
  millets: { name: 'Millets & Grains', desc: 'Organic millets, ancient grains, and traditional rice varieties', icon: Leaf },
  oils: { name: 'Cold Pressed Oils', desc: 'Wood-pressed oils using traditional ghani method, chemical-free', icon: Leaf },
  spices: { name: 'Natural Spices', desc: 'Premium spices from the hill regions of India', icon: Sparkles },
  ghee: { name: 'A2 Ghee & Dairy', desc: 'Bilona method A2 ghee from indigenous Gir cows', icon: Leaf },
  pickles: { name: 'Pickles & Snacks', desc: 'Homemade traditional pickles without preservatives', icon: Leaf },
  herbal: { name: 'Herbal Tea & Powders', desc: 'Organic teas, herbal infusions, and wellness powders', icon: Sparkles },
  dryfruits: { name: 'Dry Fruits & Nuts', desc: 'Premium quality dry fruits sourced directly from farms', icon: Leaf },
  jaggery: { name: 'Jaggery & Sweeteners', desc: 'Natural palm jaggery, raw honey, and traditional sweeteners', icon: Leaf },
  rice: { name: 'Traditional Rice', desc: 'Organic traditional rice varieties from different regions', icon: Leaf },
  coffee: { name: 'Coffee', desc: 'Single-origin organic coffee beans from hill plantations', icon: Sparkles },
  organic: { name: 'Organic Collection', desc: 'Certified organic products grown without chemicals', icon: Leaf },
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
      {/* Header */}
      <div className="border-b border-primary-100 bg-white">
        <div className="container-custom py-5">
          <div className="flex items-center gap-3 mb-1">
            {category && (
              <Link href="/products">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <Leaf className={cn('h-5 w-5', category ? 'text-primary-600' : 'text-primary-600')} />
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">
              {catMeta ? catMeta.name : search ? `Search: ${search}` : 'All Products'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {catMeta?.name || (search ? `Results for "${search}"` : 'All Natural Products')}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {catMeta?.desc || (search ? `Showing products matching "${search}"` : 'Browse our complete collection of premium natural foods, sourced directly from farms and tribal communities')}
          </p>
          {category && catMeta && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-200 text-xs font-medium">
                <Leaf className="h-3 w-3 mr-1" />{catMeta.name}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
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

          {/* Main Content */}
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
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-square rounded-2xl bg-primary-100/50" />
                      <Skeleton className="h-4 w-3/4 bg-primary-100/50" />
                      <Skeleton className="h-4 w-1/2 bg-primary-100/50" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="mt-16">
                <EmptyState
                  icon="generic"
                  title="Failed to load products"
                  description="We couldn't fetch the product list. Please check your connection and try again."
                  actions={[
                    { label: 'Refresh Page', onClick: () => window.location.reload(), variant: 'default' },
                  ]}
                />
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && data?.content.length === 0 && (
              <div className="mt-16">
                <EmptyState
                  icon="search"
                  title="No products found"
                  description="Try adjusting your filters or search terms. We have a wide range of natural products waiting for you."
                  actions={[
                    { label: 'Clear All Filters', onClick: clearAllFilters, variant: 'default' },
                  ]}
                />
              </div>
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
          <Skeleton className="h-8 w-48 bg-primary-100/50" />
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl bg-primary-100/50" />
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
