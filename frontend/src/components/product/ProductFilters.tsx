'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, ChevronUp, Star, Leaf, Tag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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
  { name: 'Natural Honey', slug: 'honey', count: 25, icon: Sparkles },
  { name: 'Millets & Grains', slug: 'millets', count: 45, icon: Leaf },
  { name: 'Cold Pressed Oils', slug: 'oils', count: 30, icon: Leaf },
  { name: 'Natural Spices', slug: 'spices', count: 40, icon: Sparkles },
  { name: 'A2 Ghee & Dairy', slug: 'ghee', count: 15, icon: Leaf },
  { name: 'Pickles & Snacks', slug: 'pickles', count: 35, icon: Tag },
  { name: 'Herbal Tea', slug: 'herbal', count: 25, icon: Leaf },
  { name: 'Dry Fruits & Nuts', slug: 'dryfruits', count: 20, icon: Leaf },
  { name: 'Jaggery & Sweeteners', slug: 'jaggery', count: 12, icon: Tag },
  { name: 'Traditional Rice', slug: 'rice', count: 20, icon: Leaf },
  { name: 'Coffee', slug: 'coffee', count: 15, icon: Sparkles },
  { name: 'Organic Collection', slug: 'organic', count: 50, icon: Leaf },
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
          <SlidersHorizontal className="h-4 w-4 text-primary-600" />
          <span className="font-bold text-sm text-gray-900">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-primary-100 text-primary-700 border-0">{activeFilterCount}</Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary-600 font-semibold hover:bg-primary-50" onClick={onClear}>
            Clear All
          </Button>
        )}
      </div>

      {/* Category */}
      <div>
        <button onClick={() => toggleSection('category')} className="flex w-full items-center justify-between py-2.5 text-sm font-bold text-gray-800">
          <span>Product Category</span>
          {sections.find(s => s.id === 'category')?.isOpen ? <ChevronUp className="h-4 w-4 text-primary-500" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </button>
        <AnimatePresence>
          {sections.find(s => s.id === 'category')?.isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-0.5 overflow-hidden">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button key={cat.slug} onClick={() => onFilterChange({ category: filters.category === cat.slug ? undefined : cat.slug })}
                    className={cn('flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors',
                      filters.category === cat.slug ? 'bg-primary-50 text-primary-700 border border-primary-200 font-semibold' : 'text-gray-600 hover:bg-primary-50/50 hover:text-primary-600')}>
                    <Icon className={cn('h-4 w-4', filters.category === cat.slug ? 'text-primary-600' : 'text-gray-400')} />
                    <span className="flex-1 text-left">{cat.name}</span>
                    <span className="text-xs text-gray-400">({cat.count})</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        <Separator className="my-2 bg-primary-100" />
      </div>

      {/* Price Range */}
      <div>
        <button onClick={() => toggleSection('price')} className="flex w-full items-center justify-between py-2.5 text-sm font-bold text-gray-800">
          <span>Price Range</span>
          {sections.find(s => s.id === 'price')?.isOpen ? <ChevronUp className="h-4 w-4 text-primary-500" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </button>
        <AnimatePresence>
          {sections.find(s => s.id === 'price')?.isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-0.5 overflow-hidden">
              {priceRanges.map((range) => (
                <button key={range.label} onClick={() => onFilterChange({
                  minPrice: filters.minPrice === range.min && filters.maxPrice === range.max ? undefined : range.min,
                  maxPrice: filters.minPrice === range.min && filters.maxPrice === range.max ? undefined : range.max,
                })}
                  className={cn('flex w-full items-center rounded-xl px-3 py-2.5 text-sm transition-colors',
                    filters.minPrice === range.min && filters.maxPrice === range.max ? 'bg-primary-50 text-primary-700 border border-primary-200 font-semibold' : 'text-gray-600 hover:bg-primary-50/50')}>
                  {range.label}
                </button>
              ))}
              <div className="flex items-center gap-2 pt-2 px-1">
                <Input placeholder="Min" value={customMinPrice} onChange={(e) => setCustomMinPrice(e.target.value)} className="h-9 text-xs border-primary-200 rounded-xl" />
                <span className="text-gray-400">-</span>
                <Input placeholder="Max" value={customMaxPrice} onChange={(e) => setCustomMaxPrice(e.target.value)} className="h-9 text-xs border-primary-200 rounded-xl" />
                <Button size="sm" className="h-9 text-xs gradient-primary text-white font-semibold rounded-xl" onClick={() => {
                  onFilterChange({ minPrice: customMinPrice ? Number(customMinPrice) : undefined, maxPrice: customMaxPrice ? Number(customMaxPrice) : undefined });
                }}>Go</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Separator className="my-2 bg-primary-100" />
      </div>

      {/* Brand */}
      <div>
        <button onClick={() => toggleSection('brand')} className="flex w-full items-center justify-between py-2.5 text-sm font-bold text-gray-800">
          <span>Brand</span>
          {sections.find(s => s.id === 'brand')?.isOpen ? <ChevronUp className="h-4 w-4 text-primary-500" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </button>
        <AnimatePresence>
          {sections.find(s => s.id === 'brand')?.isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-0.5 overflow-hidden">
              {naturalBrands.map((brand) => (
                <label key={brand} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-primary-50/50 transition-colors">
                  <input type="checkbox" checked={filters.brand?.includes(brand) || false} onChange={() => toggleBrand(brand)} 
                    className="h-4 w-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-gray-600">{brand}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <Separator className="my-2 bg-primary-100" />
      </div>

      {/* Rating */}
      <div>
        <button onClick={() => toggleSection('rating')} className="flex w-full items-center justify-between py-2.5 text-sm font-bold text-gray-800">
          <span>Rating</span>
          {sections.find(s => s.id === 'rating')?.isOpen ? <ChevronUp className="h-4 w-4 text-primary-500" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </button>
        <AnimatePresence>
          {sections.find(s => s.id === 'rating')?.isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-0.5 overflow-hidden">
              {[4, 3, 2, 1].map((rating) => (
                <button key={rating} onClick={() => onFilterChange({ rating: filters.rating === rating ? undefined : rating })}
                  className={cn('flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors',
                    filters.rating === rating ? 'bg-primary-50 border border-primary-200' : 'hover:bg-primary-50/50')}>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={cn('h-3.5 w-3.5', star <= rating ? 'fill-accent-400 text-accent-400' : 'text-gray-200')} />
                    ))}
                  </div>
                  <span className="text-gray-500 text-xs">& up</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <Separator className="my-2 bg-primary-100" />
      </div>

      {/* Other Filters */}
      <div>
        <button onClick={() => toggleSection('other')} className="flex w-full items-center justify-between py-2.5 text-sm font-bold text-gray-800">
          <span>Other Filters</span>
          {sections.find(s => s.id === 'other')?.isOpen ? <ChevronUp className="h-4 w-4 text-primary-500" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </button>
        <AnimatePresence>
          {sections.find(s => s.id === 'other')?.isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-1 overflow-hidden pt-1">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-primary-50/50 transition-colors">
                <input type="checkbox" checked={filters.inStock || false} onChange={(e) => onFilterChange({ inStock: e.target.checked || undefined })} 
                  className="h-4 w-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-gray-600">In Stock Only</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-primary-50/50 transition-colors">
                <input type="checkbox" checked={filters.onSale || false} onChange={(e) => onFilterChange({ onSale: e.target.checked || undefined })} 
                  className="h-4 w-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-gray-600">On Sale</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-primary-50/50 transition-colors">
                <input type="checkbox" className="h-4 w-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-gray-600">Organic Certified</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-primary-50/50 transition-colors">
                <input type="checkbox" className="h-4 w-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-gray-600">Tribal & Hill Products</span>
              </label>
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
        <div className="sticky top-24 rounded-2xl border border-primary-100 bg-white p-4 shadow-sm">
          <FilterContent {...props} />
        </div>
      </div>

      {/* Mobile Filters (Sheet) */}
      <Sheet>
        <SheetTrigger className="lg:hidden inline-flex items-center justify-center gap-2 rounded-xl border border-primary-200 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 shadow-sm outline-none transition-colors hover:bg-primary-50">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {props.filters.category || props.filters.brand?.length ? (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-primary-100 text-primary-700 border-0">
              {(props.filters.category ? 1 : 0) + (props.filters.brand?.length || 0)}
            </Badge>
          ) : null}
        </SheetTrigger>
        <SheetContent side="left" className="w-full max-w-sm">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary-600" />
              Filters
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <FilterContent {...props} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
