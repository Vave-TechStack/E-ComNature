'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star, Search, Check, X, Trash2, Eye, Filter,
  ThumbsUp, ThumbsDown, MessageSquare, Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const REVIEWS = [
  {
    id: 1, customer: 'Priya Sharma', product: 'Forest Raw Honey (500g)', rating: 5,
    title: 'Absolutely pure and delicious!',
    body: 'This honey is unlike anything I have tasted before. Thick, dark amber with a rich floral taste. No sugar crystals. 100% authentic. I have been a regular customer for 6 months.',
    helpful: 24, notHelpful: 1, status: 'Published', date: '2026-07-18', verified: true,
    reply: null,
  },
  {
    id: 2, customer: 'Rohan Gupta', product: 'A2 Gir Cow Ghee (500ml)', rating: 4,
    title: 'Excellent quality, slightly pricey',
    body: 'The ghee smells and tastes authentic. Granular texture confirms it is real desi ghee. Packaging is nice too. A bit expensive but worth it for the quality.',
    helpful: 18, notHelpful: 0, status: 'Published', date: '2026-07-17', verified: true,
    reply: 'Thank you, Rohan! We use only Gir cows for our A2 ghee — the price reflects the quality and ethical sourcing. 🙏',
  },
  {
    id: 3, customer: 'Ananya Nair', product: 'Lakadong Turmeric Powder (250g)', rating: 5,
    title: 'Best turmeric I have ever used',
    body: 'Bright orange-yellow, strong aroma, high curcumin. My golden milk has never been so good. Definitely recommend to anyone looking for genuine Lakadong.',
    helpful: 31, notHelpful: 2, status: 'Published', date: '2026-07-16', verified: true,
    reply: null,
  },
  {
    id: 4, customer: 'Kiran Reddy', product: 'Cold Pressed Coconut Oil (1L)', rating: 2,
    title: 'Not as expected',
    body: 'The oil smells good but the quantity felt less than 1L. The bottle was also slightly dented when it arrived. Hoping for better packaging next time.',
    helpful: 8, notHelpful: 5, status: 'Pending', date: '2026-07-20', verified: true,
    reply: null,
  },
  {
    id: 5, customer: 'Meena Iyer', product: 'Organic Palm Jaggery (500g)', rating: 5,
    title: 'Childhood taste restored!',
    body: 'This brings back memories of the jaggery from my grandmother\'s village. Pure, unrefined, earthy sweetness. Amazing in coffee and sweets. Will buy again and again!',
    helpful: 42, notHelpful: 0, status: 'Published', date: '2026-07-15', verified: true,
    reply: null,
  },
  {
    id: 6, customer: 'Arun Verma', product: 'Organic Foxtail Millet (1kg)', rating: 3,
    title: 'Good product, slow delivery',
    body: 'Millet quality is fine. No complaints about the grain itself. But delivery took 9 days which is way too long. Hope the logistics improve.',
    helpful: 12, notHelpful: 3, status: 'Pending', date: '2026-07-21', verified: false,
    reply: null,
  },
  {
    id: 7, customer: 'Sunita Das', product: 'Forest Raw Honey (500g)', rating: 1,
    title: 'Smells fermented',
    body: 'The honey had a strange fermented smell when opened. Not sure if it was stored properly. Very disappointed with this purchase. Requesting a refund.',
    helpful: 3, notHelpful: 1, status: 'Flagged', date: '2026-07-19', verified: true,
    reply: null,
  },
];

const STATUS_CONFIG: Record<string, string> = {
  Published: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Pending:   'bg-amber-100 text-amber-700 border-amber-200',
  Flagged:   'bg-red-100 text-red-700 border-red-200',
  Rejected:  'bg-gray-100 text-gray-400 border-gray-200',
};

const STATUSES = ['All', 'Published', 'Pending', 'Flagged'];

function StarRow({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sz = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={cn(sz, n <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} />
      ))}
    </div>
  );
}

function getInitials(name: string) {
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

export default function AdminReviewsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [reviews, setReviews] = useState(REVIEWS);

  const approve = (id: number) =>
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'Published' } : r));
  const reject = (id: number) =>
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
  const remove = (id: number) =>
    setReviews(prev => prev.filter(r => r.id !== id));

  const filtered = reviews.filter(r =>
    (statusFilter === 'All' || r.status === statusFilter) &&
    (ratingFilter === 0 || r.rating === ratingFilter) &&
    (r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.product.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase()))
  );

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  const ratingDist = [5, 4, 3, 2, 1].map(n => ({
    star: n,
    count: reviews.filter(r => r.rating === n).length,
    pct: Math.round((reviews.filter(r => r.rating === n).length / reviews.length) * 100),
  }));

  return (
    <div className="space-y-5">

      {/* Header */}
      <motion.div {...fade()} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-50 to-amber-100">
              <Star className="h-4 w-4 text-amber-500" />
            </div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Feedback</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-400 mt-0.5">{reviews.length} total · {reviews.filter(r => r.status === 'Pending').length} awaiting moderation</p>
        </div>
      </motion.div>

      {/* Rating overview + stats */}
      <motion.div {...fade(0.06)} className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Average rating */}
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-5 flex items-center gap-4">
          <div className="text-center">
            <p className="text-5xl font-extrabold text-amber-500">{avgRating}</p>
            <StarRow rating={Math.round(parseFloat(avgRating))} size="lg" />
            <p className="text-xs text-gray-500 mt-1">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {ratingDist.map((d) => (
              <div key={d.star} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-3">{d.star}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                <div className="flex-1 h-1.5 rounded-full bg-amber-100">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-4">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Published', value: reviews.filter(r => r.status === 'Published').length, bg: 'bg-emerald-50', color: 'text-emerald-700' },
            { label: 'Pending', value: reviews.filter(r => r.status === 'Pending').length, bg: 'bg-amber-50', color: 'text-amber-700' },
            { label: 'Flagged', value: reviews.filter(r => r.status === 'Flagged').length, bg: 'bg-red-50', color: 'text-red-600' },
            { label: 'Verified Buyers', value: reviews.filter(r => r.verified).length, bg: 'bg-blue-50', color: 'text-blue-700' },
            { label: 'With Images', value: 0, bg: 'bg-gray-50', color: 'text-gray-600' },
            { label: 'With Reply', value: reviews.filter(r => r.reply).length, bg: 'bg-violet-50', color: 'text-violet-700' },
          ].map((s) => (
            <div key={s.label} className={cn('rounded-xl border border-gray-200 p-3 text-center', s.bg)}>
              <p className={cn('text-2xl font-extrabold', s.color)}>{s.value}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div {...fade(0.1)} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search by customer, product or keyword…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-gray-200 bg-white focus:border-amber-400" />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {STATUSES.map((st) => (
            <button key={st} onClick={() => setStatusFilter(st)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap',
                statusFilter === st ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              )}>
              {st}
            </button>
          ))}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRatingFilter(ratingFilter === n ? 0 : n)}
                className={cn(
                  'flex items-center justify-center h-8 w-8 rounded-xl border transition-all',
                  ratingFilter === n ? 'bg-amber-400 border-amber-400 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-amber-300'
                )}>
                {n}⭐
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Review cards */}
      <div className="space-y-3">
        {filtered.map((review, i) => (
          <motion.div key={review.id} {...fade(i * 0.04)}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-amber-100 to-yellow-100 text-amber-700 font-bold text-sm">
                  {getInitials(review.customer)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-gray-900">{review.customer}</p>
                      {review.verified && (
                        <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-2 py-0.5 font-semibold">
                          ✓ Verified Buyer
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRow rating={review.rating} />
                      <span className="text-[11px] text-gray-400">{review.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn('text-[10px] border', STATUS_CONFIG[review.status])}>
                      {review.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-2">
                  <Leaf className="h-3 w-3 text-emerald-500 shrink-0" />
                  <p className="text-xs font-semibold text-emerald-700">{review.product}</p>
                </div>

                <p className="text-sm font-bold text-gray-900 mt-2">"{review.title}"</p>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed line-clamp-3">{review.body}</p>

                {/* Reply */}
                {review.reply && (
                  <div className="mt-3 rounded-xl bg-gray-50 border border-gray-100 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MessageSquare className="h-3 w-3 text-emerald-600" />
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">NatureKart Reply</span>
                    </div>
                    <p className="text-xs text-gray-600 italic">{review.reply}</p>
                  </div>
                )}

                {/* Helpful + actions */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <ThumbsUp className="h-3 w-3 text-gray-400" /> {review.helpful}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <ThumbsDown className="h-3 w-3 text-gray-400" /> {review.notHelpful}
                    </span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {review.status === 'Pending' || review.status === 'Flagged' ? (
                      <>
                        <Button size="sm" onClick={() => approve(review.id)}
                          className="h-7 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1 px-3">
                          <Check className="h-3 w-3" /> Approve
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => reject(review.id)}
                          className="h-7 rounded-xl text-xs text-red-600 border-red-200 hover:bg-red-50 gap-1 px-3">
                          <X className="h-3 w-3" /> Reject
                        </Button>
                      </>
                    ) : (
                      <Button variant="ghost" size="sm"
                        className="h-7 rounded-xl text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 gap-1 px-3">
                        <MessageSquare className="h-3 w-3" /> Reply
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => remove(review.id)}
                      className="h-7 w-7 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400 rounded-2xl border border-gray-200 bg-white">
            <Star className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No reviews found</p>
          </div>
        )}
      </div>
    </div>
  );
}
