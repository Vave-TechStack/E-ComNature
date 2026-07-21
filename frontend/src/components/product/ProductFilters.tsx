'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal, ChevronDown, Star, Leaf, Tag, Sparkles,
  Box, Cookie, Droplets, Wheat, Apple, Coffee, Sun, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface FilterSection {
  id: string;
  title: string;
  isOpen: boolean;
}

interface ProductFiltersProps {
  filters: {
    category?: string;
    brand?: string[];
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    inStock?: boolean;
    onSale?: boolean;
  };
  onFilterChange: (filters: Partial<ProductFiltersProps['filters']>) => void;
  onClear: () => void;
}

const categories = [
  { name: 'Natural Honey', slug: 'honey', count: 25, icon: Sparkles, color: 'text-amber-500' },
  { name: 'Millets & Grains', slug: 'millets', count: 45, icon: Wheat, color: 'text-yellow-600' },
  { name: 'Cold Pressed Oils', slug: 'oils', count: 30, icon: Droplets, color: 'text-green-600' },
  { name: 'Natural Spices', slug: 'spices', count: 40, icon: Sparkles, color: 'text-red-500' },
  { name: 'A2 Ghee & Dairy', slug: 'ghee', count: 15, icon: Box, color: 'text-orange-500' },
  { name: 'Pickles & Snacks', slug: 'pickles', count: 35, icon: Cookie, color: 'text-rose-500' },
  { name: 'Herbal Tea', slug: 'herbal', count: 25, icon: Coffee, color: 'text-teal-500' },
  { name: 'Dry Fruits & Nuts', slug: 'dryfruits', count: 20, icon: Apple, color: 'text-emerald-600' },
  { name: 'Jaggery & Sweeteners', slug: 'jaggery', count: 12, icon: Tag, color: 'text-amber-600' },
  { name: 'Traditional Rice', slug: 'rice', count: 20, icon: Wheat, color: 'text-yellow-500' },
  { name: 'Coffee', slug: 'coffee', count: 15, icon: Coffee, color: 'text-amber-700' },
  { name: 'Organic Collection', slug: 'organic', count: 50, icon: Leaf, color: 'text-emerald-500' },
];

const naturalBrands = [
  'Araku Tribal Co-op', 'Organic Valley', 'Gramiya', 'Gir Farms',
  'Traditional Harvest', 'Meghalaya Organic', 'Mountain Brew', "Grandma's Kitchen",
];

const priceRanges = [
  { label: 'Under ₹199', min: 0, max: 199 },
  { label: '₹199 - ₹499', min: 199, max: 499 },
  { label: '₹499 - ₹999', min: 499, max: 999 },
  { label: '₹999 - ₹1,999', min: 999, max: 1999 },
  { label: 'Over ₹1,999', min: 1999, max: 999999 },
];

function FilterContent({ filters, onFilterChange, onClear }: ProductFiltersProps) {
  const [sections, setSections] = useState<FilterSection[]>([
    { id: 'category', title: 'Product Category', isOpen: true },
    { id: 'price', title: 'Price Range', isOpen: true },
    { id: 'brand', title: 'Brand', isOpen: false },
    { id: 'rating', title: 'Rating', isOpen: false },
    { id: 'other', title: 'Other Filters', isOpen: false },
  ]);

  const [customMinPrice, setCustomMinPrice] = useState('');
  const [customMaxPrice, setCustomMaxPrice] = useState('');

  const toggleSection = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, isOpen: !s.isOpen } : s));
  };

  const toggleBrand = (brand: string) => {
    const current = filters.brand || [];
    const updated = current.includes(brand)
      ? current.filter(b => b !== brand)
      : [...current, brand];
    onFilterChange({ brand: updated });
  };

  const activeFilterCount = [
    filters.category,
    ...(filters.brand || []),
    filters.minPrice,
    filters.maxPrice,
    filters.rating,
    filters.inStock,
    filters.onSale,
  ].filter(Boolean).length;

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-primary-100">
            <SlidersHorizontal className="h-4 w-4 text-primary-600" />
          </div>
          <span className="font-bold text-sm text-noble-800">Filters</span>
          {activeFilterCount > 0 && (
            <Badge className="h-5 px-1.5 text-xs bg-primary-100 text-primary-700 border-0 rounded-full">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-primary-600 font-semibold hover:bg-primary-50 rounded-lg"
            onClick={onClear}
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Category */}
      <div className="mb-1">
        <button
          onClick={() => toggleSection('category')}
          className="flex w-full items-center justify-between py-2.5 px-1 text-sm font-bold text-noble-800 hover:text-primary-600 transition-colors rounded-lg"
        >
          <span>Product Category</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-noble-400 transition-transform duration-200',
              sections.find(s => s.id === 'category')?.isOpen && 'rotate-180'
            )}
          />
        </button>
        <AnimatePresence initial={false}>
          {sections.find(s => s.id === 'category')?.isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="space-y-0.5 overflow-hidden"
            >
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = filters.category === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => onFilterChange({ category: isActive ? undefined : cat.slug })}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                      isActive
                        ? 'bg-primary-50 text-primary-700 border border-primary-200 font-semibold shadow-sm'
                        : 'text-noble-500 hover:bg-noble-50 hover:text-primary-600'
                    )}
                  >
                    <Icon className={cn('h-4 w-4', cat.color)} />
                    <span className="flex-1 text-left">{cat.name}</span>
                    <span className="text-xs text-noble-400 tabular-nums">({cat.count})</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="my-2 h-px bg-gradient-to-r from-noble-100 via-noble-200 to-noble-100" />
      </div>

      {/* Price Range */}
      <div className="mb-1">
        <button
          onClick={() => toggleSection('price')}
          className="flex w-full items-center justify-between py-2.5 px-1 text-sm font-bold text-noble-800 hover:text-primary-600 transition-colors rounded-lg"
        >
          <span>Price Range</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-noble-400 transition-transform duration-200',
              sections.find(s => s.id === 'price')?.isOpen && 'rotate-180'
            )}
          />
        </button>
        <AnimatePresence initial={false}>
          {sections.find(s => s.id === 'price')?.isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="space-y-0.5 overflow-hidden"
            >
              {priceRanges.map((range) => {
                const isActive = filters.minPrice === range.min && filters.maxPrice === range.max;
                return (
                  <button
                    key={range.label}
                    onClick={() => onFilterChange({
                      minPrice: isActive ? undefined : range.min,
                      maxPrice: isActive ? undefined : range.max,
                    })}
                    className={cn(
                      'flex w-full items-center rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                      isActive
                        ? 'bg-primary-50 text-primary-700 border border-primary-200 font-semibold shadow-sm'
                        : 'text-noble-500 hover:bg-noble-50'
                    )}
                  >
                    {range.label}
                  </button>
                );
              })}
              <div className="flex items-center gap-2 pt-2 px-1">
                <Input
                  placeholder="Min"
                  value={customMinPrice}
                  onChange={(e) => setCustomMinPrice(e.target.value)}
                  className="h-9 text-xs border-noble-200 focus:border-primary-400 rounded-xl"
                />
                <span className="text-noble-300">—</span>
                <Input
                  placeholder="Max"
                  value={customMaxPrice}
                  onChange={(e) => setCustomMaxPrice(e.target.value)}
                  className="h-9 text-xs border-noble-200 focus:border-primary-400 rounded-xl"
                />
                <Button
                  size="sm"
                  className="h-9 text-xs gradient-primary text-white font-semibold rounded-xl shadow-sm"
                  onClick={() => {
                    onFilterChange({
                      minPrice: customMinPrice ? Number(customMinPrice) : undefined,
                      maxPrice: customMaxPrice ? Number(customMaxPrice) : undefined,
                    });
                  }}
                >
                  <Search className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="my-2 h-px bg-gradient-to-r from-noble-100 via-noble-200 to-noble-100" />
      </div>

      {/* Brand */}
      <div className="mb-1">
        <button
          onClick={() => toggleSection('brand')}
          className="flex w-full items-center justify-between py-2.5 px-1 text-sm font-bold text-noble-800 hover:text-primary-600 transition-colors rounded-lg"
        >
          <span>Brand</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-noble-400 transition-transform duration-200',
              sections.find(s => s.id === 'brand')?.isOpen && 'rotate-180'
            )}
          />
        </button>
        <AnimatePresence initial={false}>
          {sections.find(s => s.id === 'brand')?.isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="space-y-0.5 overflow-hidden"
            >
              {naturalBrands.map((brand) => {
                const isChecked = filters.brand?.includes(brand) || false;
                return (
                  <label
                    key={brand}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                      isChecked ? 'bg-primary-50/50' : 'hover:bg-noble-50'
                    )}
                  >
                    <div className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-200',
                      isChecked
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-noble-300 hover:border-primary-400'
                    )}>
                      {isChecked && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleBrand(brand)}
                      className="sr-only"
                    />
                    <span className="text-noble-600">{brand}</span>
                  </label>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="my-2 h-px bg-gradient-to-r from-noble-100 via-noble-200 to-noble-100" />
      </div>

      {/* Rating */}
      <div className="mb-1">
        <button
          onClick={() => toggleSection('rating')}
          className="flex w-full items-center justify-between py-2.5 px-1 text-sm font-bold text-noble-800 hover:text-primary-600 transition-colors rounded-lg"
        >
          <span>Rating</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-noble-400 transition-transform duration-200',
              sections.find(s => s.id === 'rating')?.isOpen && 'rotate-180'
            )}
          />
        </button>
        <AnimatePresence initial={false}>
          {sections.find(s => s.id === 'rating')?.isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="space-y-0.5 overflow-hidden"
            >
              {[4, 3, 2, 1].map((rating) => {
                const isActive = filters.rating === rating;
                return (
                  <button
                    key={rating}
                    onClick={() => onFilterChange({ rating: isActive ? undefined : rating })}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                      isActive
                        ? 'bg-primary-50 border border-primary-200 shadow-sm'
                        : 'hover:bg-noble-50'
                    )}
                  >
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'h-3.5 w-3.5',
                            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-noble-200'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-noble-400 text-xs">&amp; up</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="my-2 h-px bg-gradient-to-r from-noble-100 via-noble-200 to-noble-100" />
      </div>

      {/* Other Filters */}
      <div className="mb-1">
        <button
          onClick={() => toggleSection('other')}
          className="flex w-full items-center justify-between py-2.5 px-1 text-sm font-bold text-noble-800 hover:text-primary-600 transition-colors rounded-lg"
        >
          <span>Other Filters</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-noble-400 transition-transform duration-200',
              sections.find(s => s.id === 'other')?.isOpen && 'rotate-180'
            )}
          />
        </button>
        <AnimatePresence initial={false}>
          {sections.find(s => s.id === 'other')?.isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="space-y-1 overflow-hidden pt-1"
            >
              {[
                { key: 'inStock', label: 'In Stock Only', icon: Leaf },
                { key: 'onSale', label: 'On Sale', icon: Tag },
                { key: 'organic', label: 'Organic Certified', icon: Leaf },
                { key: 'tribal', label: 'Tribal & Hill Products', icon: Sparkles },
              ].map((item) => {
                const Icon = item.icon;
                const isChecked = item.key === 'inStock'
                  ? filters.inStock || false
                  : item.key === 'onSale'
                  ? filters.onSale || false
                  : false;
                return (
                  <label
                    key={item.key}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                      isChecked ? 'bg-primary-50/50' : 'hover:bg-noble-50'
                    )}
                  >
                    <div className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-200',
                      isChecked
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-noble-300 hover:border-primary-400'
                    )}>
                      {isChecked && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (item.key === 'inStock') onFilterChange({ inStock: e.target.checked || undefined });
                        else if (item.key === 'onSale') onFilterChange({ onSale: e.target.checked || undefined });
                      }}
                      className="sr-only"
                    />
                    <Icon className="h-4 w-4 text-noble-400" />
                    <span className="text-noble-600">{item.label}</span>
                  </label>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ProductFilters(props: ProductFiltersProps) {
  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-noble-200 bg-gradient-to-br from-white to-noble-50/50 p-5 shadow-sm">
          <FilterContent {...props} />
        </div>
      </div>

      {/* Mobile Filters (Sheet) */}
      <Sheet>
        <SheetTrigger className="lg:hidden inline-flex items-center justify-center gap-2 rounded-xl border border-noble-200 bg-white px-4 py-2.5 text-sm font-semibold text-noble-700 shadow-sm outline-none transition-colors hover:bg-noble-50 hover:border-noble-300">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {props.filters.category || props.filters.brand?.length ? (
            <Badge className="ml-1 h-5 px-1.5 text-xs bg-primary-100 text-primary-700 border-0 rounded-full">
              {(props.filters.category ? 1 : 0) + (props.filters.brand?.length || 0)}
            </Badge>
          ) : null}
        </SheetTrigger>
        <SheetContent side="left" className="w-full max-w-sm">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-noble-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-primary-100">
                <SlidersHorizontal className="h-4 w-4 text-primary-600" />
              </div>
              Filters
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent {...props} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
