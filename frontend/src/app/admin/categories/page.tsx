'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Tags, ChevronRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 1, name: 'Honey & Sweeteners', slug: 'honey-sweeteners', products: 24, active: true, icon: '🍯', description: 'Raw honey, jaggery, natural sweeteners' },
  { id: 2, name: 'Cold Pressed Oils', slug: 'cold-pressed-oils', products: 18, active: true, icon: '🫙', description: 'Coconut, sesame, groundnut, mustard oils' },
  { id: 3, name: 'Millets & Grains', slug: 'millets-grains', products: 31, active: true, icon: '🌾', description: 'Foxtail, barnyard, kodo, little millet' },
  { id: 4, name: 'Spices & Masalas', slug: 'spices-masalas', products: 42, active: true, icon: '🌶️', description: 'Turmeric, pepper, cardamom, masala blends' },
  { id: 5, name: 'Ghee & Dairy', slug: 'ghee-dairy', products: 12, active: true, icon: '🧈', description: 'A2 cow ghee, buffalo ghee, cultured butter' },
  { id: 6, name: 'Pickles & Preserves', slug: 'pickles-preserves', products: 19, active: true, icon: '🥒', description: 'Mango, lemon, mixed vegetable pickles' },
  { id: 7, name: 'Superfoods', slug: 'superfoods', products: 15, active: true, icon: '🌿', description: 'Moringa, ashwagandha, amla, wheatgrass' },
  { id: 8, name: 'Tea & Infusions', slug: 'tea-infusions', products: 9, active: false, icon: '🍃', description: 'Herbal teas, green tea, kadha blends' },
  { id: 9, name: 'Flours & Powders', slug: 'flours-powders', products: 22, active: true, icon: '🌰', description: 'Ragi, jowar, bajra, multi-grain flour' },
  { id: 10, name: 'Dry Fruits & Nuts', slug: 'dry-fruits-nuts', products: 16, active: false, icon: '🥜', description: 'Almonds, cashews, walnuts, raisins' },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filtered = CATEGORIES.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'active' ? c.active : !c.active);
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <motion.div {...fade()} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-50 to-orange-100">
              <Tags className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Catalog</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} categories · {CATEGORIES.reduce((a, c) => a + c.products, 0)} total products</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-200/50 rounded-xl h-9 shrink-0">
          <Plus className="h-3.5 w-3.5" /> New Category
        </Button>
      </motion.div>

      {/* ── Stats ── */}
      <motion.div {...fade(0.06)} className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: CATEGORIES.length, color: 'text-gray-800', bg: 'bg-gray-50' },
          { label: 'Active', value: CATEGORIES.filter(c => c.active).length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Inactive', value: CATEGORIES.filter(c => !c.active).length, color: 'text-gray-400', bg: 'bg-gray-50' },
        ].map((s) => (
          <div key={s.label} className={cn('rounded-xl border border-gray-200 p-3 text-center', s.bg)}>
            <p className={cn('text-xl font-extrabold', s.color)}>{s.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Filters ── */}
      <motion.div {...fade(0.1)} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-gray-200 bg-white focus:border-emerald-400"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-semibold border capitalize transition-all',
                filter === f
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300',
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Category Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((cat, i) => (
          <motion.div
            key={cat.id}
            {...fade(i * 0.04)}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 text-2xl shrink-0 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">{cat.name}</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5 font-mono">/{cat.slug}</p>
                </div>
              </div>
              <Badge className={cn(
                'text-[10px] shrink-0',
                cat.active ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-400 border-gray-200'
              )}>
                {cat.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <p className="mt-3 text-xs text-gray-500 line-clamp-2">{cat.description}</p>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Package className="h-3.5 w-3.5 text-gray-400" />
                <span className="font-semibold text-gray-700">{cat.products}</span> products
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50">
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-gray-400 rounded-2xl border border-gray-200 bg-white">
          <Tags className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No categories found</p>
        </div>
      )}
    </div>
  );
}
