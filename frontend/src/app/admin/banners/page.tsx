'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Image as ImageIcon, Eye, ToggleLeft, ToggleRight, Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const BANNERS = [
  {
    id: 1, title: 'Summer Honey Sale', subtitle: 'Up to 25% off on all honey products',
    placement: 'Homepage Hero', device: 'All', active: true, clicks: 12480, impressions: 84200,
    startDate: '2026-07-01', endDate: '2026-07-31', color: 'from-amber-400 to-orange-500', emoji: '🍯',
  },
  {
    id: 2, title: 'Free Shipping Week', subtitle: 'Free delivery on orders above ₹199',
    placement: 'Homepage Strip', device: 'All', active: true, clicks: 9320, impressions: 62400,
    startDate: '2026-07-15', endDate: '2026-07-22', color: 'from-emerald-500 to-teal-600', emoji: '🚚',
  },
  {
    id: 3, title: 'New Millet Range', subtitle: 'Discover 12 new ancient grain products',
    placement: 'Category Page', device: 'Desktop', active: true, clicks: 4210, impressions: 28700,
    startDate: '2026-07-10', endDate: '2026-08-10', color: 'from-lime-500 to-green-600', emoji: '🌾',
  },
  {
    id: 4, title: 'App Exclusive Deal', subtitle: '₹100 cashback on first app order',
    placement: 'Homepage Hero', device: 'Mobile', active: false, clicks: 1840, impressions: 15600,
    startDate: '2026-06-01', endDate: '2026-06-30', color: 'from-purple-500 to-violet-600', emoji: '📱',
  },
  {
    id: 5, title: 'Festive Season Prep', subtitle: 'Gift hampers starting at ₹999',
    placement: 'Homepage Hero', device: 'All', active: true, clicks: 0, impressions: 0,
    startDate: '2026-10-01', endDate: '2026-10-31', color: 'from-pink-500 to-rose-600', emoji: '🎁',
  },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

export default function AdminBannersPage() {
  const [banners, setBanners] = useState(BANNERS);

  const toggleActive = (id: number) => {
    setBanners((prev) => prev.map((b) => b.id === id ? { ...b, active: !b.active } : b));
  };

  const ctr = (clicks: number, impressions: number) =>
    impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) + '%' : '—';

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div {...fade()} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-50 to-rose-100">
              <ImageIcon className="h-4 w-4 text-pink-600" />
            </div>
            <span className="text-xs font-bold text-pink-600 uppercase tracking-widest">Promotions</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
          <p className="text-sm text-gray-400 mt-0.5">{banners.filter(b => b.active).length} active banners</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-200/50 rounded-xl h-9 shrink-0">
          <Plus className="h-3.5 w-3.5" /> New Banner
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div {...fade(0.06)} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Banners', value: banners.length, color: 'text-gray-800', bg: 'bg-gray-50' },
          { label: 'Active', value: banners.filter(b => b.active).length, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Total Clicks', value: banners.reduce((s, b) => s + b.clicks, 0).toLocaleString(), color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Impressions', value: (banners.reduce((s, b) => s + b.impressions, 0) / 1000).toFixed(1) + 'K', color: 'text-violet-700', bg: 'bg-violet-50' },
        ].map((s) => (
          <div key={s.label} className={cn('rounded-xl border border-gray-200 p-3 text-center', s.bg)}>
            <p className={cn('text-xl font-extrabold', s.color)}>{s.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Banner cards */}
      <div className="space-y-4">
        {banners.map((banner, i) => (
          <motion.div key={banner.id} {...fade(i * 0.05)}
            className="group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Preview */}
              <div className={cn(
                'flex items-center justify-center bg-gradient-to-br sm:w-56 h-32 sm:h-auto shrink-0 p-4',
                banner.color
              )}>
                <div className="text-center">
                  <div className="text-4xl mb-1">{banner.emoji}</div>
                  <p className="text-white font-bold text-sm text-center leading-tight">{banner.title}</p>
                  <p className="text-white/80 text-[11px] mt-1 text-center">{banner.subtitle}</p>
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900">{banner.title}</h3>
                      <Badge className={cn(
                        'text-[10px]',
                        banner.active ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-400 border-gray-200'
                      )}>
                        {banner.active ? 'Live' : 'Paused'}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] border-gray-200 text-gray-500 gap-1">
                        {banner.device === 'Mobile' ? <Smartphone className="h-2.5 w-2.5" /> : <Monitor className="h-2.5 w-2.5" />}
                        {banner.device}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{banner.subtitle}</p>
                    <p className="text-[11px] text-gray-400 mt-1">Placement: <span className="font-medium text-gray-600">{banner.placement}</span></p>
                  </div>

                  {/* Toggle */}
                  <button onClick={() => toggleActive(banner.id)} className="shrink-0 mt-0.5">
                    {banner.active
                      ? <ToggleRight className="h-6 w-6 text-emerald-500" />
                      : <ToggleLeft className="h-6 w-6 text-gray-300" />}
                  </button>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: 'Clicks', value: banner.clicks.toLocaleString() },
                    { label: 'Impressions', value: banner.impressions > 0 ? (banner.impressions / 1000).toFixed(1) + 'K' : '—' },
                    { label: 'CTR', value: ctr(banner.clicks, banner.impressions) },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg bg-gray-50 border border-gray-100 p-2.5 text-center">
                      <p className="text-sm font-bold text-gray-800">{stat.value}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Date + actions */}
                <div className="flex items-center justify-between mt-3">
                  <p className="text-[11px] text-gray-400">
                    {banner.startDate} → {banner.endDate}
                  </p>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
