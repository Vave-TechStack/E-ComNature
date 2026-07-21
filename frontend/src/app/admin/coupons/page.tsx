'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Percent, Copy, CheckCheck, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const COUPONS = [
  { id: 1, code: 'NATURE10', type: 'Percentage', value: 10, minOrder: 500, uses: 1240, maxUses: 5000, expiry: '2026-08-31', active: true, description: 'Get 10% off on orders above ₹500' },
  { id: 2, code: 'WELCOME50', type: 'Flat', value: 50, minOrder: 299, uses: 842, maxUses: 2000, expiry: '2026-09-30', active: true, description: 'New user flat ₹50 off' },
  { id: 3, code: 'HONEY20', type: 'Percentage', value: 20, minOrder: 649, uses: 394, maxUses: 1000, expiry: '2026-07-31', active: true, description: '20% off on all honey products' },
  { id: 4, code: 'FREESHIP', type: 'Free Shipping', value: 0, minOrder: 199, uses: 3210, maxUses: 10000, expiry: '2026-12-31', active: true, description: 'Free shipping on orders above ₹199' },
  { id: 5, code: 'MILLET15', type: 'Percentage', value: 15, minOrder: 249, uses: 256, maxUses: 500, expiry: '2026-07-20', active: false, description: '15% off on millet range — expired' },
  { id: 6, code: 'FESTIVE25', type: 'Percentage', value: 25, minOrder: 999, uses: 0, maxUses: 3000, expiry: '2026-10-15', active: true, description: 'Festive season special 25% discount' },
  { id: 7, code: 'GHEE100', type: 'Flat', value: 100, minOrder: 899, uses: 178, maxUses: 500, expiry: '2026-08-15', active: true, description: 'Flat ₹100 off on A2 Ghee orders' },
];

const TYPE_COLOR: Record<string, string> = {
  Percentage: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Flat: 'bg-blue-100 text-blue-700 border-blue-200',
  'Free Shipping': 'bg-violet-100 text-violet-700 border-violet-200',
};

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

export default function AdminCouponsPage() {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = COUPONS.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const active = COUPONS.filter(c => c.active).length;
  const totalUses = COUPONS.reduce((s, c) => s + c.uses, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div {...fade()} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-50 to-purple-100">
              <Percent className="h-4 w-4 text-violet-600" />
            </div>
            <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">Promotions</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-400 mt-0.5">{active} active · {totalUses.toLocaleString()} total uses</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-200/50 rounded-xl h-9 shrink-0">
          <Plus className="h-3.5 w-3.5" /> Create Coupon
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div {...fade(0.06)} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Coupons', value: COUPONS.length, bg: 'bg-gray-50', color: 'text-gray-800' },
          { label: 'Active', value: active, bg: 'bg-emerald-50', color: 'text-emerald-700' },
          { label: 'Total Uses', value: totalUses.toLocaleString(), bg: 'bg-blue-50', color: 'text-blue-700' },
          { label: 'Expired', value: COUPONS.filter(c => !c.active).length, bg: 'bg-red-50', color: 'text-red-600' },
        ].map((s) => (
          <div key={s.label} className={cn('rounded-xl border border-gray-200 p-3 text-center', s.bg)}>
            <p className={cn('text-xl font-extrabold', s.color)}>{s.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div {...fade(0.1)}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search coupons…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-gray-200 bg-white focus:border-emerald-400"
          />
        </div>
      </motion.div>

      {/* Coupons table / cards */}
      <motion.div {...fade(0.14)} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Desktop table */}
        <div className="hidden sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                {['Code', 'Type', 'Discount', 'Min Order', 'Usage', 'Expiry', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((coupon) => {
                const used = Math.round((coupon.uses / coupon.maxUses) * 100);
                return (
                  <tr key={coupon.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2.5 py-1">
                          <Tag className="h-3 w-3 text-gray-500" />
                          <span className="font-mono text-xs font-bold text-gray-700">{coupon.code}</span>
                        </div>
                        <button onClick={() => handleCopy(coupon.code)}
                          className="text-gray-400 hover:text-emerald-600 transition-colors">
                          {copied === coupon.code ? <CheckCheck className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={cn('text-[10px] border', TYPE_COLOR[coupon.type])}>{coupon.type}</Badge>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-800">
                      {coupon.type === 'Percentage' ? `${coupon.value}%` : coupon.type === 'Flat' ? `₹${coupon.value}` : 'Free'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">₹{coupon.minOrder}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">{coupon.uses}/{coupon.maxUses}</span>
                          <span className="font-semibold text-gray-700">{used}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-100">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${used}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {coupon.expiry}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={coupon.active ? 'bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]' : 'bg-gray-100 text-gray-400 border-gray-200 text-[10px]'}>
                        {coupon.active ? 'Active' : 'Expired'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-gray-100">
          {filtered.map((coupon) => (
            <div key={coupon.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2.5 py-1">
                    <Tag className="h-3 w-3 text-gray-500" />
                    <span className="font-mono text-xs font-bold text-gray-700">{coupon.code}</span>
                  </div>
                  <button onClick={() => handleCopy(coupon.code)} className="text-gray-400">
                    {copied === coupon.code ? <CheckCheck className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <Badge className={coupon.active ? 'bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]' : 'bg-gray-100 text-gray-400 text-[10px]'}>
                  {coupon.active ? 'Active' : 'Expired'}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">{coupon.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>Discount: <strong className="text-gray-800">{coupon.type === 'Percentage' ? `${coupon.value}%` : coupon.type === 'Flat' ? `₹${coupon.value}` : 'Free shipping'}</strong></span>
                <span>Min: <strong className="text-gray-800">₹{coupon.minOrder}</strong></span>
                <span>Uses: <strong className="text-gray-800">{coupon.uses}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
