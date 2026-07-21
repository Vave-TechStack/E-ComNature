'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Search, Filter, Eye, Edit, Trash2,
  Leaf, Download, Package, ChevronUp, ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn, formatPrice } from '@/lib/utils';

const ALL_PRODUCTS = [
  { name: 'Forest Raw Honey (500g)', sku: 'HNY-FRH-500', category: 'Honey', price: 649, stock: 120, status: 'Active' },
  { name: 'Organic Foxtail Millet (1kg)', sku: 'MLT-FOX-1K', category: 'Millets', price: 249, stock: 85, status: 'Active' },
  { name: 'Cold Pressed Coconut Oil (1L)', sku: 'OIL-CCO-1L', category: 'Oils', price: 499, stock: 60, status: 'Active' },
  { name: 'Wood Pressed Sesame Oil (500ml)', sku: 'OIL-SES-500', category: 'Oils', price: 399, stock: 0, status: 'Out of Stock' },
  { name: 'Lakadong Turmeric Powder (250g)', sku: 'SPC-TUR-250', category: 'Spices', price: 349, stock: 45, status: 'Active' },
  { name: 'A2 Gir Cow Ghee (500ml)', sku: 'GHE-A2-500', category: 'Ghee', price: 899, stock: 30, status: 'Active' },
  { name: 'Traditional Mango Pickle (500g)', sku: 'PCL-MNG-500', category: 'Pickles', price: 199, stock: 0, status: 'Discontinued' },
  { name: 'Organic Palm Jaggery (500g)', sku: 'JGR-PLM-500', category: 'Jaggery', price: 179, stock: 95, status: 'Active' },
  { name: 'Moringa Leaf Powder (200g)', sku: 'MRN-LPW-200', category: 'Superfoods', price: 279, stock: 58, status: 'Active' },
  { name: 'Barnyard Millet (1kg)', sku: 'MLT-BRN-1K', category: 'Millets', price: 219, stock: 140, status: 'Active' },
  { name: 'Cold Pressed Groundnut Oil (1L)', sku: 'OIL-GND-1L', category: 'Oils', price: 329, stock: 22, status: 'Active' },
  { name: 'Sidr Honey (250g)', sku: 'HNY-SDR-250', category: 'Honey', price: 1249, stock: 0, status: 'Out of Stock' },
];

const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Out of Stock': 'bg-red-100 text-red-700 border-red-200',
  Discontinued: 'bg-gray-100 text-gray-500 border-gray-200',
};

const CATEGORIES = ['All', 'Honey', 'Millets', 'Oils', 'Spices', 'Ghee', 'Pickles', 'Jaggery', 'Superfoods'];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortField, setSortField] = useState<'name' | 'price' | 'stock' | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: 'name' | 'price' | 'stock') => {
    if (sortField === field) setSortAsc((a) => !a);
    else { setSortField(field); setSortAsc(true); }
  };

  const filtered = ALL_PRODUCTS
    .filter((p) =>
      (category === 'All' || p.category === category) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const v = sortField === 'name'
        ? a.name.localeCompare(b.name)
        : (a[sortField] as number) - (b[sortField] as number);
      return sortAsc ? v : -v;
    });

  const SortIcon = ({ field }: { field: 'name' | 'price' | 'stock' }) =>
    sortField === field
      ? (sortAsc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)
      : <ArrowUpDown className="h-3 w-3 opacity-30" />;

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <motion.div {...fade()} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
              <Package className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Inventory</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} of {ALL_PRODUCTS.length} products</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" className="gap-2 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 h-9">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-200/50 rounded-xl h-9">
            <Plus className="h-3.5 w-3.5" /> Add Product
          </Button>
        </div>
      </motion.div>

      {/* ── Search + Filter ── */}
      <motion.div {...fade(0.08)} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-gray-200 bg-white focus:border-emerald-400 focus:ring-emerald-200"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap',
                category === cat
                  ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Stats row ── */}
      <motion.div {...fade(0.12)} className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active', count: ALL_PRODUCTS.filter(p => p.status === 'Active').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Out of Stock', count: ALL_PRODUCTS.filter(p => p.status === 'Out of Stock').length, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Discontinued', count: ALL_PRODUCTS.filter(p => p.status === 'Discontinued').length, color: 'text-gray-500', bg: 'bg-gray-50' },
        ].map((s) => (
          <div key={s.label} className={cn('rounded-xl border border-gray-200 p-3 text-center', s.bg)}>
            <p className={cn('text-xl font-extrabold', s.color)}>{s.count}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Table (desktop) / Cards (mobile) ── */}
      <motion.div {...fade(0.16)} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <button className="flex items-center gap-1 hover:text-gray-700 transition-colors" onClick={() => handleSort('name')}>
                    Product <SortIcon field="name" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">SKU</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <button className="flex items-center gap-1 hover:text-gray-700 transition-colors" onClick={() => handleSort('price')}>
                    Price <SortIcon field="price" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <button className="flex items-center gap-1 hover:text-gray-700 transition-colors" onClick={() => handleSort('stock')}>
                    Stock <SortIcon field="stock" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((product, index) => (
                <tr key={product.sku} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 to-green-100 group-hover:scale-110 transition-transform">
                        <Leaf className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <span className="font-semibold text-gray-800 truncate max-w-[200px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-gray-400">{product.sku}</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="rounded-full text-[10px] border-gray-200 text-gray-500">{product.category}</Badge>
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-800">{formatPrice(product.price)}</td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      'font-semibold tabular-nums text-sm',
                      product.stock === 0 ? 'text-red-600' : product.stock < 40 ? 'text-amber-600' : 'text-gray-800'
                    )}>
                      {product.stock === 0 ? '—' : product.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={cn('rounded-full text-[10px] font-semibold border', STATUS_COLORS[product.status])}>
                      {product.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-gray-100">
          {filtered.map((product) => (
            <div key={product.sku} className="flex items-center gap-3 p-4 hover:bg-gray-50/60 transition-colors">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-green-100">
                <Leaf className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
                <p className="text-[11px] text-gray-400 font-mono">{product.sku} · {product.category}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={cn('rounded-full text-[10px] font-semibold border', STATUS_COLORS[product.status])}>
                    {product.status}
                  </Badge>
                  <span className={cn(
                    'text-[11px] font-semibold',
                    product.stock === 0 ? 'text-red-500' : product.stock < 40 ? 'text-amber-500' : 'text-gray-500'
                  )}>
                    {product.stock === 0 ? 'No stock' : `${product.stock} in stock`}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</p>
                <div className="flex gap-1 mt-1.5 justify-end">
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No products found</p>
            <p className="text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
