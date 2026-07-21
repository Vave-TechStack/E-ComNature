'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Store, Star, Package, Globe, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const BRANDS = [
  {
    id: 1, name: 'NatureKart Originals', slug: 'naturekart-originals',
    logo: '🌿', country: 'India', products: 48, rating: 4.8, orders: 12480,
    active: true, verified: true,
    description: 'Our in-house brand for premium natural and organic products',
    website: 'naturekart.in',
  },
  {
    id: 2, name: 'Himalayan Bees', slug: 'himalayan-bees',
    logo: '🐝', country: 'India', products: 14, rating: 4.9, orders: 5230,
    active: true, verified: true,
    description: 'Pure Himalayan honey sourced directly from beekeepers',
    website: 'himalayanbees.in',
  },
  {
    id: 3, name: 'Gir Farms', slug: 'gir-farms',
    logo: '🐄', country: 'India', products: 9, rating: 4.7, orders: 3120,
    active: true, verified: true,
    description: 'Authentic A2 dairy products from Gir cow farms in Gujarat',
    website: 'girfarms.co.in',
  },
  {
    id: 4, name: 'Meghalaya Spice Co.', slug: 'meghalaya-spice',
    logo: '🌶️', country: 'India', products: 22, rating: 4.6, orders: 4890,
    active: true, verified: true,
    description: 'Premium spices including Lakadong turmeric from Northeast India',
    website: 'meghalayaspice.com',
  },
  {
    id: 5, name: 'Millet Magic', slug: 'millet-magic',
    logo: '🌾', country: 'India', products: 31, rating: 4.5, orders: 6740,
    active: true, verified: false,
    description: 'Ancient grains and millet-based products for modern health',
    website: 'milletmagic.in',
  },
  {
    id: 6, name: 'Kerala Pressed', slug: 'kerala-pressed',
    logo: '🥥', country: 'India', products: 11, rating: 4.8, orders: 2960,
    active: true, verified: true,
    description: 'Cold-pressed coconut and sesame oils from Kerala',
    website: 'keralapressed.com',
  },
  {
    id: 7, name: 'Forest Folk', slug: 'forest-folk',
    logo: '🌲', country: 'India', products: 17, rating: 4.3, orders: 1840,
    active: false, verified: false,
    description: 'Wild-harvested herbs and forest products',
    website: 'forestfolk.in',
  },
  {
    id: 8, name: 'Pickles & More', slug: 'pickles-more',
    logo: '🫙', country: 'India', products: 19, rating: 4.4, orders: 2310,
    active: true, verified: false,
    description: 'Traditional Andhra-style pickles and preserves',
    website: 'picklesandmore.in',
  },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
      <span className="text-xs font-bold text-gray-700">{rating}</span>
    </div>
  );
}

export default function AdminBrandsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filtered = BRANDS.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'active' ? b.active : !b.active);
    return matchSearch && matchFilter;
  });

  const totalProducts = BRANDS.reduce((sum, b) => sum + b.products, 0);
  const totalOrders = BRANDS.reduce((sum, b) => sum + b.orders, 0);

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <motion.div {...fade()} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100">
              <Store className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Vendors</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="text-sm text-gray-400 mt-0.5">{BRANDS.length} brands · {totalProducts} products · {totalOrders.toLocaleString()} orders</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-200/50 rounded-xl h-9 shrink-0">
          <Plus className="h-3.5 w-3.5" /> Add Brand
        </Button>
      </motion.div>

      {/* ── Summary cards ── */}
      <motion.div {...fade(0.06)} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Brands', value: BRANDS.length, icon: '🏷️', color: 'bg-blue-50 text-blue-700' },
          { label: 'Active', value: BRANDS.filter(b => b.active).length, icon: '✅', color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Verified', value: BRANDS.filter(b => b.verified).length, icon: '🔵', color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Total Products', value: totalProducts, icon: '📦', color: 'bg-amber-50 text-amber-700' },
        ].map((s) => (
          <div key={s.label} className={cn('rounded-xl border border-gray-200 p-4', s.color.split(' ')[0])}>
            <div className="flex items-center justify-between">
              <span className="text-xl">{s.icon}</span>
              <p className={cn('text-2xl font-extrabold', s.color.split(' ')[1])}>{s.value}</p>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-2">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Search + Filter ── */}
      <motion.div {...fade(0.1)} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search brands…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-gray-200 bg-white focus:border-emerald-400"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-semibold border capitalize transition-all',
                filter === f ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              )}>
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Brand Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
        {filtered.map((brand, i) => (
          <motion.div key={brand.id} {...fade(i * 0.05)}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
          >
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-3xl group-hover:scale-110 transition-transform">
                {brand.logo}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-sm">{brand.name}</h3>
                      {brand.verified && (
                        <span className="text-blue-500 text-sm" title="Verified">✓</span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">/{brand.slug}</p>
                  </div>
                  <Badge className={cn(
                    'text-[10px] shrink-0',
                    brand.active ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-400 border-gray-200'
                  )}>
                    {brand.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{brand.description}</p>

                {/* Stats row */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Package className="h-3 w-3 text-gray-400" />
                    <span className="font-semibold text-gray-700">{brand.products}</span> products
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">{brand.orders.toLocaleString()}</span> orders
                  </div>
                  <StarRating rating={brand.rating} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <a
                href={`https://${brand.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 transition-colors"
              >
                <Globe className="h-3 w-3" />
                {brand.website}
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-gray-400 rounded-2xl border border-gray-200 bg-white">
          <Store className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No brands found</p>
        </div>
      )}
    </div>
  );
}
